const uuid = require("uuid").v4
const { extend } = require("lodash")

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")

const config = require("../../.config/ade-import")

let DATABASE = config.ADE_DATABASE //SPARROW_DATABASE

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
            // console.log()
        }

    }
    console.log()
    return idList

}

const { parseArgs } = require('node:util');

const processDataset = async () => {

    const args = process.argv;
    const options = {
        collection: {
            type: 'string',
            short: 'c'
        },
        skip: {
            type: 'string',
            short: 's'
        },
        limit: {
            type: 'string',
            short: 'l'
        },
        id: {
            type: 'string'
        },
    };

    const {
        values,
        positionals
    } = parseArgs({ args, options, allowPositionals: true });

    console.table(values)
   
    COLLECTION = values?.collection || LABELING_COLLECTION
    let $skip = Number.parseInt(values?.skip) || 0
    let $limit = Number.parseInt(values?.limit) || LIMIT
    const id = values?.id || ""

    let partitions = COLLECTION.split(".")
    DATASET_CLUSTER = (partitions.length == 2) ? first(partitions) : "ADE"
    DATABASE = config[DATASET_CLUSTER]

    if (id) {

        const spectrogramDir = `ADE-SPECTROGRAMS/${id}`

        const res = [
            { file: `${spectrogramDir}/low/spectrogram.png`, exists: await s3.objectExists(`${spectrogramDir}/low/spectrogram.png`), url: await s3.getPresignedUrl(`${spectrogramDir}/low/spectrogram.png`) },
            { file: `${spectrogramDir}/medium/spectrogram.png`, exists: await s3.objectExists(`${spectrogramDir}/medium/spectrogram.png`), url: await s3.getPresignedUrl(`${spectrogramDir}/medium/spectrogram.png`) },
            { file: `${spectrogramDir}/low/waveform.json`, exists: await s3.objectExists(`${spectrogramDir}/low/waveform.json`), url: await s3.getPresignedUrl(`${spectrogramDir}/low/waveform.json`) },
            { file: `${spectrogramDir}/medium/waveform.json`, exists: await s3.objectExists(`${spectrogramDir}/medium/waveform.json`), url: await s3.getPresignedUrl(`${spectrogramDir}/medium/waveform.json`) }
        ]
        console.table(res)

        return
    }


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
    // console.log(JSON.stringify(idList))
    
    await docdb.replaceOne({
        db: DATABASE,
        collection: 'spectrogram.checks',
        filter: { id: uuid()},
        data:{
            date: new Date(),
            collection: COLLECTION,
            message: `Spectrogram not exists for ${idList.length} items`,
            idList
        }

    })

}

processDataset()