 const { extend } = require("lodash")
 const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

 const log = require("../utils//logger")(__filename)

 const docdb = require("../utils/docdb")

 const s3 = require("../utils/s3-bucket")

 const config = require("../../.config/ade-import")

 const {
     LABELING_COLLECTION,
     LIMIT,
     REFRESH_INTERVAL,
     DATABASE_CLUSTER
 } = require("./spectrogram.config")

 let TASK_LIST = require("./spectrogram.config").TASK_LIST


 const DATABASE = config[DATABASE_CLUSTER]

 const configRB = config.rabbitmq.TEST
 const normalize = configRB.normalize

 const STAGE_NAME = "SPECTROGRAM SCHEDULER"
 const SERVICE_NAME = `${STAGE_NAME} microservice`

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

 const DATA_PUBLISHER = normalize({
     exchange: {
         name: 'spectrogram_task_exchange',
         mode: "direct",
         options: {
             durable: true,
             persistent: true
         }
     }
 })


 // const LABELING_COLLECTION = 'sparrow.clinic4'
 // const LIMIT = 10
 // const REFRESH_INTERVAL = 1 * 30 * 1000 // 1 min

 
 let totalRecords = 0

 let consumer

 const getConsumer = async () => {
     if (!consumer) {
         consumer = await AmqpManager.createConsumer(DATA_CONSUMER)
     }
     return consumer
 }

 let publisher
 const getPublisher = async () => {
     if (!publisher) {
         publisher = await AmqpManager.createPublisher(DATA_PUBLISHER)
         publisher.use(Middlewares.Json.stringify)
     }
     return publisher
 }


 const eventLoopForTaskList = async () => {

     log('SPECTROGRAM SCHEDULER LOOP:', new Date())

     let consumer = await getConsumer()
     let assertion = await consumer.getStatus()
     log.table([assertion])

     if (
         assertion.messageCount > 2 * LIMIT
         // || assertion.consumerCount == 0
     ) {
         log(`Skip task generation.`)
         return
     }

     let partition = TASK_LIST.splice(0, LIMIT)

     log(`generate ${partition.length} tasks`)
     
     const publisher = await getPublisher()

     for (let id of partition) {
         await publisher.send({ id })
     }

 }



 const eventLoop = async () => {

     log('SPECTROGRAM SCHEDULER LOOP:', new Date())

     let consumer = await getConsumer()
     let assertion = await consumer.getStatus()
     log.table([assertion])

     if (
         assertion.messageCount > 2 * LIMIT
         // || assertion.consumerCount == 0
     ) {
         log(`Skip task generation.`)
         return
     }

     const pipeline = [{
             $match: {
                 "spectrogram": {
                     $ne: true
                 }
             }
         },
         {
             $limit: LIMIT
         },
         {
             $project: {
                 _id: 0,
                 id: "$id",
             },
         },
     ]

     const idList = await docdb.aggregate({
         db: DATABASE,
         collection: LABELING_COLLECTION,
         pipeline
     })

     if (idList.length == 0) {
         log(`No task. Skip task generation.`)
         return
     }

     const publisher = await getPublisher()

     for (let id of idList) {
         await publisher.send(id)
     }

     await docdb.updateMany({
         db: DATABASE,
         collection: LABELING_COLLECTION,
         filter: {
             id: {
                 $in: idList.map(d => d.id)
             }
         },
         data: {
             "spectrogram": true
         }
     })

     let left = await docdb.aggregate({
         db: DATABASE,
         collection: LABELING_COLLECTION,
         pipeline: [{
                 $match: {
                     spectrogram: {
                         $ne: true
                     }
                 }
             },
             {
                 $group: {
                     _id: 1,
                     count: {
                         $sum: 1
                     }
                 }
             }
         ]
     })
     left = (left.length > 0) ? left[0].count : 0
     log(`${totalRecords - left} tasks generated. ${left} tasks left.`)

 }

 const exists = async id => {
     const spectrogramDir = `ADE-SPECTROGRAMS/${id}`
     const result = (await s3.objectExists(`${spectrogramDir}/low/spectrogram.png`)) &&
         (await s3.objectExists(`${spectrogramDir}/medium/spectrogram.png`)) &&
         (await s3.objectExists(`${spectrogramDir}/low/waveform.json`)) &&
         (await s3.objectExists(`${spectrogramDir}/medium/waveform.json`))
     return result
 }


 const run = async () => {

     log(`Configure ${SERVICE_NAME}`)
     log("Data Consumer:", DATA_CONSUMER)
     log("Data Publisher:", DATA_PUBLISHER)
     log("DB:", config.docdb[DATABASE])
     log("LABELING_COLLECTION", LABELING_COLLECTION)
     log(("TASK LIST", (TASK_LIST || []).length))
     log("LIMIT", LIMIT)
     log("REFRESH_INTERVAL:", REFRESH_INTERVAL)
     log(`${SERVICE_NAME} started`)



     if (TASK_LIST.length > 0) {
         
         const notResolvedTasks = []
         let index = 0
         for (let id of TASK_LIST) {
             index++
             const resolved = await exists(id)
             process.stdout.write(`${index} from ${TASK_LIST.length}: ${id}: ${resolved}                                     ${'\x1b[0G'}`)
             if (!resolved) {
                 console.log()
                 notResolvedTasks.push(id)
             }

         }
         console.log()

         log(`${notResolvedTasks.length} from ${TASK_LIST.length} will be processed/`)

         TASK_LIST = notResolvedTasks

         await eventLoopForTaskList()
         setInterval(eventLoopForTaskList, REFRESH_INTERVAL)

     } else {

         let docs = await docdb.aggregate({
             db: DATABASE,
             collection: LABELING_COLLECTION,
             pipeline: [{
                 $count: "count",
             }, ]
         })

         totalRecords = (docs.length > 0) ? docs[0].count : 0

         await eventLoop()
         setInterval(eventLoop, REFRESH_INTERVAL)

     }

 }

 run()