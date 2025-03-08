const { extend, isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log  = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const STAGE_NAME = "Task Log Store"
const SERVICE_NAME = `${STAGE_NAME} microservice`
const DATA_CONSUMER = configRB.consumer.taskLog
const REPORT_PUBLISHER = configRB.publisher.taskLog



const processData = async (err, msg, next) => {

    try {

        msg.content.data = (msg.content.data) ? msg.content.data : [msg.content.content]
        msg.content.data = (isArray(msg.content.data)) ? msg.content.data : [msg.content.data] 

        let commands = msg.content.data.map( d => {
                return {
                    replaceOne: {
                        filter: { id: d.id },
                        replacement: d,
                        upsert: true
                    }
                }
        })

        if (commands.length > 0) {
            await docdb.bulkWrite({
                db: DATABASE,
                collection: "ADE-SETTINGS.task-log",
                commands
            })
        }

        next()

    } catch (e) {

        log(e.toString(), e.stack)
        throw e

    }
}

const run = async () => {

    log(`Configure ${SERVICE_NAME}`)
    log("Data Consumer:", DATA_CONSUMER)
    log("Report Publisher:", REPORT_PUBLISHER)
    log("DB:", config.docdb[DATABASE])
    

    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)


    await consumer
        .use(Middlewares.Json.parse)

        .use((err, msg, next) => {
            log("Request:", msg.content.requestId, " start")
            next()
        })

        .use(processData)
   
        .use(Middlewares.Error.Log)
        // .use(Middlewares.Error.BreakChain)

        .use((err, msg, next) => {
            log("Request:", msg.content.requestId, " done")
            msg.ack()
        
        })

        .start()

    log(`${SERVICE_NAME} started`)

}

run()