const uuid = require("uuid").v4
const { extend } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const STAGE_NAME = "Task Scheduler"
const SERVICE_NAME = `${STAGE_NAME} microservice`
const DATA_CONSUMER = configRB.consumer.taskScheduler

const REFRESH_INTERVAL = 1 * 60 * 1000 // 1 min

const { getAgentList } = require("./workflow-connection")


const eventLoop = async () => {
    
    console.log('Event Loop:', new Date())

    const agentList = await getAgentList()
    if(agentList.length == 0) {
        console.log(`ADE not available or active workflows not exists`)
        return
    }

    const pipeline = [
      {
        $match:{
            "data.alias": {
                $in: agentList
            }
        }
      }, 
      {
        $group: {
          _id: "$publisher.exchange.name",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
        },
      },
    ]

    let publishers = await docdb.aggregate({
        db: DATABASE,
        collection: "ADE-SETTINGS.deferred-tasks",
        pipeline
    })

    for(let pub of publishers){
    
        const pipeline = [
          {
            $match: {
              "publisher.exchange.name": pub.name,
            },
          },
          {
            $sort: {
              createdAt: 1,
            },
          },
          {
            $limit: 20,
          },
        ]


        let taskList = await docdb.aggregate({
            db: DATABASE,
            collection: "ADE-SETTINGS.deferred-tasks",
            pipeline
        })

        console.log(`Send to ${pub.name} ${taskList.length} tasks`)
        
        if(taskList.length == 0) continue


        for(let task of taskList){
            let publisher = await AmqpManager.createPublisher(task.publisher)
            publisher.use(Middlewares.Json.stringify)
            publisher.send(task.data)
        }

        await docdb.deleteMany({
            db: DATABASE,
            collection: "ADE-SETTINGS.deferred-tasks",
            filter:{
                id: {
                    $in: taskList.map(t => t.id)
                }
            }
        })
    }
}


const processData = async (err, message, next) => {

    try {

        message.content.id = uuid()
        message.content.createdAt = new Date()
        console.log("Process:", message.content.data.key)
        
        await docdb.replaceOne({
            db: DATABASE,
            collection: "ADE-SETTINGS.deferred-tasks",
            filter: {id: message.content.id},
            data: message.content
        })

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

        .use(processData)

        .use(Middlewares.Error.Log)
        // .use(Middlewares.Error.BreakChain)

        .use((err, msg, next) => {
            msg.ack()
        })

        .start()

    console.log(`${SERVICE_NAME} started`)

    setInterval(eventLoop, REFRESH_INTERVAL)


}

run()