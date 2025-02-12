const { extend } = require("lodash")
const uuid = require("uuid").v4

const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const STAGE_NAME = "No Create Task Store"
const SERVICE_NAME = `${STAGE_NAME} microservice`
const DATA_CONSUMER = configRB.consumer.noCreateTask



const processData = async (err, msg, next) => {

    try {

        let commands = [msg.content].map(d => {
                return {
                    replaceOne: {
                        filter: { id: d.id },
                        replacement: extend({}, d, {id: uuid()}),
                        upsert: true
                    }
                }
        })

        if (commands.length > 0) {
            await docdb.bulkWrite({
                db: DATABASE,
                collection: "ADE-SETTINGS.no-created-tasks",
                commands
            })
        }

        next()

    } catch (e) {

        console.log(e.toString(), e.stack)
        throw e

    }
}

const run = async () => {

    console.log(`Configure ${SERVICE_NAME}`)
    console.log("Data Consumer:", DATA_CONSUMER)
    console.log("DB:", config.docdb[DATABASE])
    
 
    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)


    await consumer
        .use(Middlewares.Json.parse)

        .use((err, msg, next) => {
            console.log("Request:", msg.content.requestId, " start")
            next()
        })
        .use(processData)
   
        .use(Middlewares.Error.Log)
        .use(Middlewares.Error.BreakChain)

        .use((err, msg, next) => {
            console.log("Request:", msg.content.requestId, " done")
            msg.ack()
        })

        .start()

    console.log(`${SERVICE_NAME} started`)

}

run()