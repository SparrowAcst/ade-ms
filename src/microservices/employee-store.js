const { extend } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const STAGE_NAME = "Employee Store"
const SERVICE_NAME = `${STAGE_NAME} microservice`
const DATA_CONSUMER = configRB.consumer.employeeDb
const REPORT_PUBLISHER = configRB.publisher.employeeDb



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

        console.log(e.toString(), e.stack)
        throw e

    }
}

const run = async () => {

    console.log(`Configure ${SERVICE_NAME}`)
    console.log("Data Consumer:", DATA_CONSUMER)
    console.log("Report Publisher:", REPORT_PUBLISHER)

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