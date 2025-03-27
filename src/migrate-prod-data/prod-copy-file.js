const { extend, isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const config = require("../../.config/ade-import")
const DATABASE = config.ADE_DATABASE
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const STAGE_NAME        = "MIGRATE PROD DATA: 2. Copy file."
const SERVICE_NAME      = `${STAGE_NAME} microservice`

const { resolveDataset } = require("./data-utils")

const s3 = require("../utils/s3-bucket")

const DEFAULT_PATH = "ADE-RECORDS"
const DEFAULT_TIME_INTERVAL = 1 * 1000
const DEFAULT_TIMEOUT = 60 * 1000


const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_prod_2",
        exchange: {
            name: 'migate_prod_2_exchange',
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
        name: 'migate_prod_3_exchange',
        options: {
            durable: true,
            persistent: true
        }
    }
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const checkFileExists = async path => {
    try {
        let res = await s3.metadata(path)
        return res
    } catch(e) {
        return false
    }   
}

const whenFileExists = async (path, timeout) => new Promise(async (resolve, reject) => {
    
    let $interval, $timeout 
    
    $timeout = setTimeout(() => {
        if($interval) clearInterval($interval)
        clearTimeout($timeout)
        reject()
    }, timeout || DEFAULT_TIMEOUT)

    let exists = await checkFileExists(path)
    if(!!exists){
        if($interval) clearInterval($interval)
        clearTimeout($timeout)
        resolve(exists)
        return  
    }

    $interval = setInterval(async () => {
        log("wait when exists", path)
        let exists = await checkFileExists(path)
        if(!!exists){
            if($interval) clearInterval($interval)
            clearTimeout($timeout)
            resolve(exists)
            return  
        }        
    }, DEFAULT_TIME_INTERVAL)

})


const processData = async (err, msg, next) => {

    try {

        log("Process", msg.content)

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

            let source
            try {
                source = await whenFileExists(`${DEFAULT_PATH}/${data.id}.wav`)
            } catch(e) {
                log(`File ${DEFAULT_PATH}/${data.id}.wav not found`)
                continue
            }

            if(dataset.path){

                log("Copy", {
                    source: `${DEFAULT_PATH}/${data.id}.wav`,
                    destination: `${dataset.path}/${data.id}.wav`
                })
                
                await s3.copyObject({
                    source: `${DEFAULT_PATH}/${data.id}.wav`,
                    destination: `${dataset.path}/${data.id}.wav`
                })
            } else {
               log("Skip", `${DEFAULT_PATH}/${data.id}.wav`)
            }
            
        }

        next()

    } catch (e) {

        log(e.toString(), e.stack)
        throw e

    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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