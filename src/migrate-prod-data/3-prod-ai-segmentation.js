const { extend, isArray } = require("lodash")
const axios = require("axios")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const config = require("../../.config/ade-import")
const DATABASE = config.ADE_DATABASE
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize
const AI_SEGMENTATION_API = config.AI_SEGMENTATION_API


const STAGE_NAME        = "MIGRATE PROD DATA: 3. AI Segmentation."
const SERVICE_NAME      = `${STAGE_NAME} microservice`

const { resolvePath } = require("./data-utils")

const s3 = require("../utils/s3-bucket")

const DEFAULT_PATH = "ADE-RECORDS"
const DEFAULT_TIME_INTERVAL = 1 * 1000
const DEFAULT_TIMEOUT = 60 * 1000


const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_prod_3",
        exchange: {
            name: 'migate_prod_3_exchange',
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
        name: 'migate_prod_4_exchange',
        options: {
            durable: true,
            persistent: true
        }
    }
})


let publisher


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

            let source
            try {
                source = await whenFileExists(`${DEFAULT_PATH}/${data.id}.wav`)
            } catch(e) {
                log(`File ${DEFAULT_PATH}/${data.id}.wav not found`)
                continue
            }

            try {
                
                let url = await s3.getPresignedUrl(`${DEFAULT_PATH}/${data.id}.wav`)
                
                log("AI Segmentation for", `${DEFAULT_PATH}/${data.id}.wav`)
                
                let response = await axios({
                    method: "POST",
                    url: AI_SEGMENTATION_API,
                    data: { url }
                })            

                data = extend({}, data, {aiSegmentation: response.data})
                log("data", data)

            } catch(e) {
                log("AI SEGMENTATION ERROR: ")
                log(`${DEFAULT_PATH}/${data.id}.wav`)
                log(`${e.toString()}: ${(e.response) ? JSON.stringify(e.response.data, null, " ") : ""}`)

                data = extend({}, data, {
                    error: `${e.toString()}: ${(e.response) ? JSON.stringify(e.response.data, null, " ") : ""}`
                })
                continue
            }
        }

        log("Send data to next stage", items)
        await publisher.send(items)

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

    publisher = await AmqpManager.createPublisher(NEXT_PUBLISHER)
    publisher.use(Middlewares.Json.stringify)

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