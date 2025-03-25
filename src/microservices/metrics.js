
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


    let data = await docdb.aggregate({
        db: DATABASE,
        collection: query.collection,
        pipeline: query.pipeline
    })    


    data = await calculate(data)

    data = data.map( d => {
        d.date = new Date()
        return d
    })

    await docdb.insertAll({
        db: DATABASE,
        collection: out.collection,
        data
    })

    let expiredDate = new Date(moment().subtract(...expired).toDate())
    log("expiredDate", expiredDate)
    
    let del = await docdb.aggregate({
        db: DATABASE,
        collection: out.collection,
        pipeline: [{
            $match: {
                date: {
                $lt: expiredDate
            }    
        }}]
    })    

    log(`delete ${del.length} items`)

    await docdb.deleteMany({
        db: DATABASE,
        collection: out.collection,
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
        metric.interval = moment.duration(...metric.interval).asMilliseconds()
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