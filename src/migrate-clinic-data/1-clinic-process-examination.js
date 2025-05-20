const { extend, isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")
const DATABASE = "CLINIC"
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const { resolveStady } = require("./data-resolver")


const STAGE_NAME = "MIGRATE CLINIC DATA: 1. Process examination."
const SERVICE_NAME = `${STAGE_NAME} microservice`

const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_clinic_1",
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
        name: 'migate_clinic_2_exchange',
        options: {
            durable: true,
            persistent: true
        }
    }
})


const processData = async (err, msg, next) => {

    try {

        
        if (!msg.content) {
            log("Cannot process empty message")
            throw new Error("Cannot process empty message")
        }

        let items = JSON.parse(JSON.stringify(msg.content))
        items = (isArray(items)) ? items : [items]

        log("Items", items)

        for (let data of items) {
            log(`Process record for examination ${data.examinationTitle} (${data.examinationId})`)
            const stady = await resolveStady(data.examinationTitle)
            if(!stady) {
                log(`Ignore ${data.examinationTitle}. No stady.`)
                next()
                return
            }
            
            let examination = await docdb.aggregate({
                db: DATABASE,
                collection: stady.collection,
                pipeline: [
                    { $match: { id: data.examinationId } },
                    { $project: { _id: 0 } }
                ]
            })

            examination = examination[0]

            if (!examination) {

                examination = {
                    id: data.examinationId,
                    patient: {},
                    ekg: {},
                    echo: {},
                    examination: {
                        "id": data.examinationId,
                        "dateTime": data.dateTime,
                        "patientId": data.examinationTitle,
                        "comment": data.notes
                    },
                    attachements:[],
                    recordings:[]
                }

                log(`Create Examination: ${examination.id} in ${stady.collection}`)
                // log(examination)

                await docdb.replaceOne({
                    db: DATABASE,
                    collection: stady.collection,
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