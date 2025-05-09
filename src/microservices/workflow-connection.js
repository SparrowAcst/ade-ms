const { flatten } = require("lodash")
const { AmqpManager, Middlewares } = require('@molfar/amqp-client');
const docdb = require("../utils/docdb")
const log = require("../utils//logger")(__filename)

const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE

const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const CONSUMER_OPTIONS = normalize({
    queue: {
        name: "employeeDbReport",
        exchange: {
            name: 'employee_db_report_exchange',
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
let CONSUMER

const isAvailableADE = async () => {

    if (!CONSUMER) {
        CONSUMER = await AmqpManager.createConsumer(CONSUMER_OPTIONS)
    }

    let assertion = await CONSUMER.getStatus()
    log.table([assertion])
    return assertion.consumerCount > 0
}

const getAgentList = async () => {

    const adeAccess = await isAvailableADE()
    log("adeAccess", adeAccess)

    if (!adeAccess) return []

    const pipeline = [{
            $match: {
                state: "available",
            },
        },
        {
            $project: {
                _id: 0,
                agents: 1,
                workflow: "$name"
            },
        },
    ]
    
    let result = await docdb.aggregate({
        db: DATABASE,
        collection: "ADE-SETTINGS.workflows",
        pipeline
    })

    result = result.map( d => d.agents.map(a => `${d.workflow}_${a.name.split(" ").join("_")}`))

    return flatten(result)
}



module.exports = {
    getAgentList,
    isAvailableADE
}

// const run = async () => {
//     let adeAccess = await isAvailableADE()
//     log("adeAccess", adeAccess)
//     let agents = await getAgentList()
//     log(agents)    
// }

// run()