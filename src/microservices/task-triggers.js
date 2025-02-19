const uuid = require("uuid").v4
const NodeCache = require("node-cache")
const moment = require("moment")
const { extend, last, isArray } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const STAGE_NAME = "Task Triggers"
const SERVICE_NAME = `${STAGE_NAME} microservice`

const CACHE = new NodeCache({
    useClones: false
})

const DATA_CONSUMER = normalize({
    queue: {
        name: "task_triggers",
        exchange: {
            name: 'task_triggers_exchange',
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

const taskKey = require("../utils/task-key")

const eventLoop = async trigger => {

    console.log(trigger.options.name, ' Event Loop:', new Date())

    let pipeline = [{
            $match: {
                name: trigger.options.workflow
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]

    let workflow = await docdb.aggregate({
        db: DATABASE,
        collection: "ADE-SETTINGS.workflows",
        pipeline
    })

    if (workflow[0] && workflow[0].state == "available") {

        pipeline = [{
                $match: {
                    triggeredAt: {
                        $exists: false
                    }
                }
            },
            {
                $limit: trigger.options.limit || 10
            },
            {
                $project: {
                    _id: 0
                }
            }
        ]

        let taskList = await docdb.aggregate({
            db: DATABASE,
            collection: trigger.options.collection,
            pipeline
        })

        if (taskList.length == 0) {
            trigger.options.log.push({
                date: new Date(),
                message: `Task pool ${trigger.options.collection} is empty.`
            })
            console.log(last(trigger.options.log))

            await trigger.stop()
        }

        let logPublisherOptions = normalize({
            exchange: {
                name: 'task_log_exchange',
                options: {
                    durable: true,
                    persistent: true
                }
            }
        })

        let logPublisher = await AmqpManager.createPublisher(logPublisherOptions)
        logPublisher
            .use(Middlewares.Json.stringify)
            .use((err, msg, next) => {
                console.log(msg)
                next()
            })

        for (let task of taskList) {

            task.taskId = uuid()
            task.workflowId = uuid()
            task.triggeredAt = new Date()
            task.state = "triggered"

            let publisherOptions = normalize({
                exchange: {
                    name: task.publisher,
                    options: {
                        durable: true,
                        persistent: true
                    }
                }
            })

            let key = taskKey()
                .workflowType(task.workflowType)
                .workflowId(task.workflowId)
                .taskType(task.agent)
                .taskId(task.taskId)
                .schema(task.schema)
                .dataCollection(task.dataCollection)
                .dataId(task.dataId)
                .savepointCollection(task.savepointCollection)
                .get()

            console.log("Emit task", key)
            console.log(publisherOptions)
            let publisher = await AmqpManager.createPublisher(publisherOptions)
            publisher
                .use(Middlewares.Json.stringify)
                .use((err, msg, next) => {
                    console.log(msg)
                    next()
                })

            publisher.send({
                alias: task.agent,
                key,
                metadata: task.metadata
            })
            // await publisher.close()   

            logPublisher.send({
                command: "store",
                collection: "ADE-SETTINGS.task-log",
                data: {
                    "key": key,
                    "user": "ADE",
                    "metadata": {
                        "task": task.agent,
                        "initiator": "assigned automatically",
                        "status": "emitted"
                    },
                    "waitFor": [],
                    "createdAt": new Date(),
                    "description": taskKey(key).getDescription()
                }
            })

        }

        let commands = taskList.map(task => ({
            updateOne: {
                filter: {
                    schema: task.schema,
                    dataCollection: task.dataCollection,
                    dataId: task.dataId
                },
                update: {
                    $set: task
                },
                upsert: true
            }
        }))

        if (commands.length > 0) {

            console.log(`Update in ${trigger.options.collection} ${commands.length} items`)

            await docdb.bulkWrite({
                db: DATABASE,
                collection: trigger.options.collection,
                commands
            })
        }
    } else {

        trigger.options.log.push({
            date: new Date(),
            message: `Parent workflow ${trigger.options.workflow} stopped.`
        })

        console.log(last(trigger.options.log))

        await trigger.stop()
    }

    console.log(`Done`)

}


const processData = async (err, message, next) => {

    try {

        let options = message.content

        if (CACHE.has(options.id)) {

            console.log(`Update trigger ${options.id}`)
            let trigger = CACHE.get(options.id)
            await trigger.update(options)

        } else {

            console.log(`Create trigger ${options.name}`)
            let trigger = new Trigger(options)
            CACHE.set(options.id, trigger)
            if (options.state == "available") {
                await trigger.start()
            }
            await trigger.update()

        }


        next()

    } catch (e) {

        console.log(e.toString(), e.stack)
        throw e

    }
}


const store = async trigger => {
    await docdb.replaceOne({
        db: DATABASE,
        collection: "ADE-SETTINGS.triggers",
        filter: { id: trigger.id },
        data: trigger
    })
}


const Trigger = class {

    constructor(options) {
        this.options = options
        this.milliseconds = moment.duration(...this.options.period)._milliseconds
        this.interval = null
        this.options.log = this.options.log || []
        this.options.log = (isArray(this.options.log)) ? this.options.log : [this.options.log]
    }

    setState(newState) {
        if (newState) {
            this.options.state = newState
        }
    }

    async start() {

        this.options.log.push({
            date: new Date(),
            message: `Trigger ${this.options.name} start successfuly.`
        })
        console.log(last(this.options.log))
        await eventLoop(this)
        this.interval = setInterval(async () => {
            await eventLoop(this)
        }, this.milliseconds)

        this.setState("available")

        await store(this.options)

    }

    async stop() {

        this.options.log.push({
            date: new Date(),
            message: `Trigger ${this.options.name} stop successfuly.`
        })
        console.log(last(this.options.log))

        clearInterval(this.interval)
        this.interval = null
        this.setState("stopped")
        await store(this.options)
    }

    async update(options) {
        console.log(options)
        if (this.options.state == "available") {
            await this.stop()
        }
        options.log = options.log || []
        options.log.push({
            date: new Date(),
            message: `Trigger ${this.options.name} update successfuly.`
        })
        extend(this.options, options)
        console.log(this.options)
        if (this.options.state == "available") {
            await this.start()
        } else if (this.options.state == "stopped") {
            await this.stop()
        }

        await store(this.options)

    }


}


const init = async () => {
    console.log("Initiate triggers...")
    const pipeline = [{ $project: { _id: 0 } }]
    let triggerList = await docdb.aggregate({
        db: DATABASE,
        collection: "ADE-SETTINGS.triggers",
        pipeline
    })

    for (let triggerOptions of triggerList) {
        let trigger = new Trigger(triggerOptions)
        console.log("Initiate trigger", triggerOptions)
        CACHE.set(trigger.options.id, trigger)
        if (triggerOptions.state == "available") {
            await trigger.start()
        }
    }

}


const run = async () => {

    console.log(`Configure ${SERVICE_NAME}`)
    console.log("Data Consumer:", DATA_CONSUMER)
    console.log("DB:", config.docdb[DATABASE])


    await init()

    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)

    await consumer
        .use(Middlewares.Json.parse)

        .use(processData)

        .use(Middlewares.Error.Log)
        .use(Middlewares.Error.BreakChain)

        .use((err, msg, next) => {
            msg.ack()
        })

        .start()

    console.log(`${SERVICE_NAME} started`)

}

run()