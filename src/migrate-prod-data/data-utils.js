const { lookUp, lookUpRaw } = require("geojson-places")
const { find, findIndex } = require("lodash")
const parse = require("./user-agent-parser")

const log = require("../utils//logger")(__filename)

const docdb = require("../utils/docdb")
const config = require("../../.config/ade-import")
const DATABASE = config.ADE_DATABASE


const getDeviceDescription = d => parse(d.userAgent)

const getGeoLocation = d => ({
    metadata: lookUp(d.latitude, d.longitude),
    country: (lookUpRaw(d.latitude, d.longitude)) ? lookUpRaw(d.latitude, d.longitude).features[0].properties.geonunit : "unknown",
    city: (lookUpRaw(d.latitude, d.longitude)) ? lookUpRaw(d.latitude, d.longitude).features[0].properties.name_en : "unknown"
})


const nameResolver = [

    { name: "Additional Validation IP16 Reproducibility, Stethophone version 2", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-RT")},
	{ name: "Additional Validation IP16 Reproducibility, Stethophone version 3", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-RT")},

    { name: "Additional Validation IP16 Performance, Stethophone version 2", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E")},
    { name: "Additional Validation IP16 Performance, Stethophone version 3", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E")},
	
    { name: "Stethophone Production Data UA part 1", rule: d => getDeviceDescription(d).appStoreRegion == "Ukraine" },
    { name: "Stethophone Production Data US part 1", rule: d => getDeviceDescription(d).appStoreRegion == "USA" },
    { name: "Stethophone Production Data CA part 1", rule: d => getDeviceDescription(d).appStoreRegion == "Canada" },

]



const resolveDataset = async d => {

    let index = findIndex(nameResolver.map(r => r.rule(d)), r => r === true)
    if(index < 0) return
    
    const datasetName = nameResolver[index].name
    let dataset = await docdb.aggregate({
        db: DATABASE,
        collection: `ADE-SETTINGS.datasets`,
        pipeline: [
            { $match: { name: datasetName } },
            { $project: { _id: 0 } }
        ]
    })

    dataset = dataset[0]
    return dataset

}



module.exports = {
    getDeviceDescription,
    getGeoLocation,
    resolveDataset
}