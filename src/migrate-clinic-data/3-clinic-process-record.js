const { isArray, findIndex } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")
const DATABASE = "CLINIC"
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const { resolveStady, getDeviceDescription, getGeoLocation } = require("./data-resolver")


const STAGE_NAME = "MIGRATE CLINIC DATA: 3. Process Record."
const SERVICE_NAME = `${STAGE_NAME} microservice`

const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_clinic_3",
        exchange: {
            name: 'migate_clinic_3_exchange',
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


const mapSpot = spot => spot


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
                
            let record = {
                "id": data.id,
                "model": "Stethophone",
                "deviceDescription": getDeviceDescription(data),
                "geoLocation": getGeoLocation(data),
                "bodyPosition": data.bodyPosition,
                "spot": mapSpot(data.spot),
                "examinationId": data.examinationId,
                "date": data.dateTime
            }


            examination.recordings = examination.recordings || []
            
            const index = findIndex(examination.recordings, d => d.id == record.id)
            
            if(index > 0){
                examination.recordings[index] = record    
            } else {
                examination.recordings.push(record)    
            }
            

            log(`Update or Create Record: ${record.id} for examination ${record.examinationId} in ${stady.collection}`)
            
            await docdb.replaceOne({
                db: DATABASE,
                collection: stady.collection,
                filter: {
                    id: data.examinationId
                },
                data: examination
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