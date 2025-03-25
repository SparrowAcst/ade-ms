const { extend } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log  = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const STAGE_NAME = "Version Store"
const SERVICE_NAME = `${STAGE_NAME} microservice`
const DATA_CONSUMER = configRB.consumer.versionDb
const REPORT_PUBLISHER = configRB.publisher.versionDbReport



const processData = async (err, msg, next) => {

    try {

        let commands = msg.content.data.map(d => {
            if (msg.content.command == "store") {
                return {
                    replaceOne: {
                        filter: { id: d.id },
                        replacement: d,
                        upsert: true
                    }
                }
            }
            if (msg.content.command == "delete") {
                return {
                    deleteOne: {
                        filter: { id: d.id }
                    }
                }
            }
        })
        
        if (commands.length > 0) {
            await docdb.bulkWrite({
                db: DATABASE,
                collection: msg.content.collection,
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


    const reportPublisher = await AmqpManager.createPublisher(REPORT_PUBLISHER)
    reportPublisher.use(Middlewares.Json.stringify)

    await consumer
        .use(Middlewares.Json.parse)

        .use(async (err, msg, next) => {
        
            log("Request:", msg.content.requestId, " start")
            
            await reportPublisher.send({
                requestId: msg.content.requestId,
                status: "start"
            })
            next()
        
        })

        .use(processData)

        .use(async (err, msg, next) => {
           
            if (err) {
                await reportPublisher.send({
                    requestId: msg.content.requestId,
                    status: "error",
                    message: msg.content,
                    error: err.toString()
                })
            }

            next()
        
        })

        .use(Middlewares.Error.Log)
        // .use(Middlewares.Error.BreakChain)


        .use((err, msg, next) => {
            
            reportPublisher.send({
                requestId: msg.content.requestId,
                status: "done"
            })

            log("Request:", msg.content.requestId, " done")
            msg.ack()
        
        })

        .start()

    log(`${SERVICE_NAME} started`)

}

run()