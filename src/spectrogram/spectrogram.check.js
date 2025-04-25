const uuid = require("uuid").v4
const { extend } = require("lodash")

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

const DATABASE = config.SPARROW_DATABASE

const s3 = require("../utils/s3-bucket")


const {
    LABELING_COLLECTION,
    LIMIT,
    REFRESH_INTERVAL
} = require("./spectrogram.config")



const processChunk = async chunk => {

    let idList = []
    let index = 0
    for (let data of chunk) {
        index++
        const spectrogramDir = `ADE-SPECTROGRAMS/${data.id}`
        const exists = await s3.objectExists(`${spectrogramDir}/low/spectrogram.png`) &&
            await s3.objectExists(`${spectrogramDir}/medium/spectrogram.png`) &&
            await s3.objectExists(`${spectrogramDir}/low/waveform.json`) &&
            await s3.objectExists(`${spectrogramDir}/medium/waveform.json`)
        
        process.stdout.write(`${index} from ${chunk.length}: ${data.id}: ${exists}                                     ${'\x1b[0G'}`)
            
        if (!exists) {
            idList.push(data.id)
        }

    }
    console.log()
    return idList

}

const processDataset = async () => {

    COLLECTION = process.argv[2] || LABELING_COLLECTION
    console.log(`collection: ${COLLECTION}`)

    let $skip = (process.argv[3]) ? Number.parseInt(process.argv[3]) : 0
    let $limit = (process.argv[4]) ? Number.parseInt(process.argv[4]) : LIMIT

    let idList = []
    let chunk = []
    
    do {
        const pipeline = [{
                $sort: {
                    id: 1,
                },
            },
            {
                $skip
            },
            {
                $limit
            },
            {
                $project: {
                    _id: 0,
                    id: "$id",
                },
            },
        ]

        chunk = await docdb.aggregate({
            db: DATABASE,
            collection: COLLECTION,
            pipeline
        })
        console.log(`chunk: from position ${$skip} - ${chunk.length} items`)
        let part = await processChunk(chunk)

        idList = idList.concat(part)

        $skip += $limit

    } while (chunk.length > 0)

    console.log(`Spectrogram not exists for ${idList.length} items:`)
    console.log(JSON.stringify(idList))
}

processDataset()