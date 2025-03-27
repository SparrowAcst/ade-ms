const { extend, isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")
const DATABASE = config.ADE_DATABASE
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const { resolveDataset } = require("./data-utils")


const STAGE_NAME = "MIGRATE PROD DATA: 1. Process examination."
const SERVICE_NAME = `${STAGE_NAME} microservice`

const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_prod_1",
        exchange: {
            name: 'migate_prod_1_exchange',
            options: {
                durable: true,
                persistent: true
            }
        },
        options: {
            noAck: false,
            exclusive: false
        }
    }
})

const NEXT_PUBLISHER = normalize({
    exchange: {
        name: 'migate_prod_2_exchange',
        options: {
            durable: true,
            persistent: true
        }
    }
})


const processData = async (err, msg, next) => {

    try {

        // log("Process", msg.content)

        if (!msg.content) {
            log("Cannot process empty message")
            return
        }

        let items = JSON.parse(JSON.stringify(msg.content))
        items = (isArray(items)) ? items : [items]

        for (let data of items) {

            let dataset = await resolveDataset(data)
            if (!dataset) {
                log(`No resolve dataset for`, data)
                continue
            }

            let examination = await docdb.aggregate({
                db: DATABASE,
                collection: `${dataset.schema}.examinations`,
                pipeline: [
                    { $match: { id: data.examinationId } },
                    { $project: { _id: 0 } }
                ]
            })

            examination = examination[0]

            if (!examination) {

                examination = {
                    "id": data.examinationId,
                    "siteId": dataset.siteId,
                    "protocol": "No Protocol",
                    "state": "accepted",
                    "comment": data.examinationTitle,
                    "forms": {
                        "patient": {
                            "type": "patient",
                            "data": {
                                "age": data.examinationAge,
                                "weight": data.examinationWeight,
                            }
                        },
                        "echo": {
                            "type": "echo",
                            "data": {}
                        },
                        "ekg": {
                            "type": "ekg",
                            "data": {}
                        },
                        "attachements": {
                            "type": "attachements",
                            "data": []
                        }
                    },
                    "updatedAt": new Date()
                }

                log(`Create Examination: ${examination.id} in ${dataset.schema}.examinations`)
                log(examination)

                await docdb.replaceOne({
                    db: DATABASE,
                    collection: `${dataset.schema}.examinations`,
                    filter: {
                        id: examination.id
                    },
                    data: examination
                })
            } else {
                log(`Examination ${examination.id} already exists`)
            }
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
    log("Next Publisher:", NEXT_PUBLISHER)
    log("DB:", config.docdb[DATABASE])

    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)

    const publisher = await AmqpManager.createPublisher(NEXT_PUBLISHER)
    publisher.use(Middlewares.Json.stringify)

    await consumer
        .use(Middlewares.Json.parse)
        .use(processData)
        .use(async (err, msg, next) => {
            if (!err) {
                await publisher.send(msg.content)
            }
            next()
        })
        .use(Middlewares.Error.Log)
        .use((err, msg, next) => {
            msg.ack()
            next()
        })
        .start()

    log(`${SERVICE_NAME} started`)

}

run()