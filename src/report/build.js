const { keys, sortBy } = require("lodash")

const docdb = require("./docdb")
const db = "SPARROW"

const datasets = {
    "Heart Harvest 1": "sparrow.harvest1-upd",
    "Heart Harvest 2": "sparrow.H2",
    "Heart Harvest 3": "sparrow.H3",
    "Heart Harvest America": "sparrow.hha",
    "ARABIA": "sparrow.arabia-labels",
    "Clinic4": "sparrow.clinic4",
    "Digiscope": "sparrow.digiscope",
    "Suspected Innocent from Reallife": "sparrow.innocent-reallife-labels",
    "Phisionet": "sparrow.phisionet",
    "Phonendo": "sparrow.phonendo",
    "Tagged records": "sparrow.taged-records",
    "Vinil": "sparrow.vinil",
    "Vintage": "sparrow.vintage",
    "YODA": "sparrow.yoda"

}





// const queries = require("./non-cmo-finalization")

const queries = require("./old-labels")


const run = async () => {
    let datasetNames = sortBy(keys(datasets))
    let featuresNames = keys(queries)
    let index = 0
    let report = []

    console.log(["No.", "Dataset"].concat(queries.map(d => d.feature)).join(";")+";")

    for (let datasetName of datasetNames) {

        index++
        
        let output = `${index};${datasetName};`
        
        for (query of queries) {
                
            const res = await docdb.aggregate({
                db,
                collection: datasets[datasetName],
                pipeline: query.pipeline
            })

            output += query.out(res)+";"
     
        }

        console.log(output)

    }

}


run()