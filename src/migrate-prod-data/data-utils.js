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

    { name: "Additional Validation IP16 Reproducibility, Stethophone Version 2", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-RT")},
	{ name: "Additional Validation IP16 Reproducibility, Stethophone Version 3", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-RT")},

    { name: "Additional Validation IP16 Performance, Stethophone Version 2", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E")},
    { name: "Additional Validation IP16 Performance, Stethophone Version 3", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E")},
	
    { name: "Stethophone Production Data UA part 1", rule: d => getDeviceDescription(d).appStoreRegion == "Ukraine" },
    { name: "Stethophone Production Data US part 1", rule: d => getDeviceDescription(d).appStoreRegion == "USA" },
    { name: "Stethophone Production Data CA part 1", rule: d => getDeviceDescription(d).appStoreRegion == "Canada" },

]


const pathResolver = [

    { path: "VALIDATION/v2-add-ip16-rt-mtm/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-RT-MTM")},
    { path: "VALIDATION/v2-add-ip16-rt-ltr/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-RT-LTR")},
    { path: "VALIDATION/v2-add-ip16-rt-oto/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-RT-OTO")},
    
    { path: "VALIDATION/v3-add-ip16-rt-mtm/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-RT-MTM")},
    { path: "VALIDATION/v3-add-ip16-rt-ltr/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-RT-LTR")},
    { path: "VALIDATION/v3-add-ip16-rt-oto/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-RT-OTO")},
    
    { path: "VALIDATION/v2-add-ip16-pt-wn/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-PT-WN")},
    { path: "VALIDATION/v2-add-ip16-pt-cshp/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-PT-CSHP")},
    { path: "VALIDATION/v2-add-ip16-pt-cs10p/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-CS10P")},
    { path: "VALIDATION/v2-add-ip16-pt-ne/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-NE")},
    { path: "VALIDATION/v2-add-ip16-pt-sr5u/records/raw", rule: d => d.examinationTitle.startsWith("V2-ADD-IP16E-PT-SR5U")},
    
    
    { path: "VALIDATION/v3-add-ip16-pt-wn/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-PT-WN")},
    { path: "VALIDATION/v3-add-ip16-pt-cshp/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-PT-CSHP")},
    { path: "VALIDATION/v3-add-ip16-pt-cs10p/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-CS10P")},
    { path: "VALIDATION/v3-add-ip16-pt-ne/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-NE")},
    { path: "VALIDATION/v3-add-ip16-pt-sr5u/records/raw", rule: d => d.examinationTitle.startsWith("V3-ADD-IP16E-PT-SR5U")},
]



const resolveDataset = async d => {

    let index = findIndex(nameResolver.map(r => r.rule(d)), r => r === true)
    if(index < 0) return
    
    const datasetName = nameResolver[index].name
    // log(d.examinationTitle)
    // log("datasetName", datasetName)
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

const resolvePath = d => {
    let index = findIndex(pathResolver.map(r => r.rule(d)), r => r === true)
    if(index < 0) return
    
    return pathResolver[index].path
}


module.exports = {
    getDeviceDescription,
    getGeoLocation,
    resolveDataset,
    resolvePath
}