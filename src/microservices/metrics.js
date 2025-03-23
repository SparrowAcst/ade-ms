
const moment = require("moment")
const log  = require("../utils//logger")(__filename)
const docdb = require("../utils/docdb")
const config = require("../../.config/ade-import")

const DATABASE = config.ADE_DATABASE
const STAGE_NAME = "Metrics"
const SERVICE_NAME = `${STAGE_NAME} microservice`

let metricDescriptions = require("./metric-descriptions")

const getMetric = async metric => {
    
    log(`Get metric: ${metric.name}`)
    
    let { name, query, calculate, out, expired } = metric

    log({ name, query, calculate, out, expired })

    let data = await docdb.aggregate({
        db: DATABASE,
        collection: query.collection,
        pipeline: query.pipeline
    })    

    log(data)
    
    data = await calculate(data)

    log(data)

    data = data.map( d => {
        d.date = new Date()
        return d
    })

    log(data)

    await docdb.insertAll({
        db: DATABASE,
        collection: out.collection,
        data
    })

    let expiredDate = moment().substract(expired)

    await docdb.deleteMany({
        db: DATABASE,
        collection: query.collection,
        filter: {
            date: {
                $lt: expiredDate
            }
        }  
    })

}



const run = async () => {
    
    log(`${SERVICE_NAME} starts`)
    
    for( let metric of metricDescriptions){
        try {
        log(`Start metric collection: ${metric.name}...`)    
        await getMetric(metric)
        metric.interval = moment.duration(metric.interval).toMiliseconds()
        log(metric.interval)
        metric.handler = setInterval(async () => {
            try {
                await getMetric(metric)    
            } catch (e) {
                log(e.toString(), e.stack)
                clearInterval(metric.handler)
            }
            
        }, metric.interval)
        } catch(e) {
            log(e.toString(), e.stack)
            continue    
        }
    }

}


run()