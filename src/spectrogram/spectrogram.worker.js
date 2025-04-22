const Tick = require('exectimer').Tick
const Timers = require('exectimer').timers
let tick = new Tick("total")
const heapMemoryGuard = require("../utils/heap-utils")

restartMetric = () => {
   if(Timers.total){
    Timers.total.ticks = []
   }
   tick.start()
}

stopMetric = () => {
   tick.stop()
}

getMetric = () => Timers.total.parse(Timers.total.duration())



const { extend, isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)

const build = require('./spectrogram')

const config = require("../../.config/ade-import")
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const STAGE_NAME        = "SPECTROGRAM WORKER"
const SERVICE_NAME      = `${STAGE_NAME} microservice`

const s3 = require("../utils/s3-bucket")

const DATA_CONSUMER = normalize({
    queue: {
        name: "spectrogram_task",
        exchange: {
            name: 'spectrogram_task_exchange',
            mode: "direct",
            options: {
                durable: true,
                persistent: true
            }
        },
        options: {
            noAck: false,
            prefetch: 1,
            exclusive: false
        }
    }
})

// const NEXT_PUBLISHER = normalize({
//     exchange: {
//         name: 'migate_prod_4_exchange',
//         options: {
//             durable: true,
//             persistent: true
//         }
//     }
// })


// let publisher


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}


const processData = async (err, msg, next) => {

    try {

        
        if (!msg.content) {
            log("Cannot process empty message")
            next()
            return
        }

        restartMetric()

        const { id } = msg.content
        
        log(id)
        const spectrogramDir = `ADE-SPECTROGRAMS/${id}`
        const exists = await s3.objectExists(`${spectrogramDir}/low/spectrogram.png`)
                    && await s3.objectExists(`${spectrogramDir}/medium/spectrogram.png`) 
                    && await s3.objectExists(`${spectrogramDir}/low/waveform.json`)
                    && await s3.objectExists(`${spectrogramDir}/medium/waveform.json`)
    
        if (!exists) {

          const existsWavFile = await s3.objectExists(`ADE-RECORDS/${id}.wav`)

          if(existsWavFile){
          
            const stream = await s3.getObjectStream(`ADE-RECORDS/${id}.wav`);
            const buffer = await streamToBuffer(stream);
             
            const visualisation = await build(buffer, {})
            
            let vizBuffer = await visualisation.spectrogram.image.lowFiltered.getBuffer("image/png")
            
            log(`Upload ${spectrogramDir}/low/spectrogram.png`)
            await s3.uploadFile(`${spectrogramDir}/low/spectrogram.png`, vizBuffer);
            
            vizBuffer = await visualisation.spectrogram.image.mediumFiltered.getBuffer("image/png")
            
            log(`Upload ${spectrogramDir}/medium/spectrogram.png`)
            await s3.uploadFile(`${spectrogramDir}/medium/spectrogram.png`, vizBuffer);
            

            log(`Upload ${spectrogramDir}/low/waveform.json`)
            await s3.uploadFile(`${spectrogramDir}/low/waveform.json`, JSON.stringify(visualisation.wave.lowFiltered))
         
            log(`Upload ${spectrogramDir}/medium/waveform.json`)
            await s3.uploadFile(`${spectrogramDir}/medium/waveform.json`, JSON.stringify(visualisation.wave.mediumFiltered))
         

           } else {
              log(`File ADE-RECORDS/${id}.wav not exists.`)
           } 
          
        } else {

          log(`Spectrogram for record ${id} already exists.`)

        }

        stopMetric()
        log(`Spectrogram generation for record ${id}: ${getMetric()}`)
     
        next()

    } catch (e) {

        log(e.toString(), e.stack)
        throw e

    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const run = async () => {

    let currentMessage = null

    let guard = heapMemoryGuard({
        heapSizeLimit: 80,
        interval: 1000,
        callback: () => {

            console.log("HEAP MEMORY GUARD break process")
            if(currentMessage){
                currentMessage.ack()
            }
            process.exit()
        
        }
    })



    log(`Configure ${SERVICE_NAME}`)
    log("Data Consumer:", DATA_CONSUMER)
   
    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)

    // publisher = await AmqpManager.createPublisher(NEXT_PUBLISHER)
    // publisher.use(Middlewares.Json.stringify)

    
    await consumer
        .use(Middlewares.Json.parse)
        .use((err, msg, next) => {
            currentMessage = msg
            next()
        })
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

