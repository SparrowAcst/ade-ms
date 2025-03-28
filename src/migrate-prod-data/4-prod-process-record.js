const { isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")
const DATABASE = config.ADE_DATABASE
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const { resolveDataset, getDeviceDescription, getGeoLocation } = require("./data-utils")


const STAGE_NAME = "MIGRATE PROD DATA: 4. Process Record."
const SERVICE_NAME = `${STAGE_NAME} microservice`

const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_prod_4",
        exchange: {
            name: 'migate_prod_4_exchange',
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


const processData = async (err, msg, next) => {

    try {

        // log("Process", msg.content)

        if (!msg.content) {
            log("Cannot process empty message")
            return
        }

        let items = JSON.parse(JSON.stringify(msg.content))
        items = (isArray(items)) ? items : [items]

        log("Items", items)

        for (let data of items) {

            let dataset = await resolveDataset(data)
            if (!dataset) {
                log(`No resolve dataset for`, data)
                continue
            }

            let record = {
                "id": data.id,
                "Age (Years)": data.examinationAge,
                "Sex at Birth": "unknown",
                "Ethnicity": "unknown",
                "model": "Stethophone",
                "deviceDescription": getDeviceDescription(data),
                "geoLocation": getGeoLocation(data),
                "Body Position": data.bodyPosition,
                "Body Spot": data.spot,
                "Systolic murmurs": [],
                "Diastolic murmurs": [],
                "Other murmurs": [],
                "Pathological findings": [],
                "state": "Continue Labeling",
                "examinationId": data.examinationId,
                "aiSegmentation": data.aiSegmentation, 
                "taskList": []
            }


            log(`Create Record: ${record.id} in ${dataset.schema}.labels`)
            log(record)

            await docdb.replaceOne({
                db: DATABASE,
                collection: `${dataset.schema}.labels`,
                filter: {
                    id: record.id
                },
                data: record
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
    log("DB:", config.docdb[DATABASE])

    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)


    await consumer
        .use(Middlewares.Json.parse)
        .use(processData)
        .use(Middlewares.Error.Log)
        .use((err, msg, next) => {
            msg.ack()
            next()
        })
        .start()

    log(`${SERVICE_NAME} started`)

}

run()