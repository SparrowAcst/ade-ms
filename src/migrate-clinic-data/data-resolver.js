const { lookUp, lookUpRaw } = require("geojson-places")
const { find, findIndex } = require("lodash")
const parse = require("./user-agent-parser")

const log = require("../utils//logger")(__filename)


const docdb = require("../utils/docdb")
const config = require("../../.config/ade-import")
const DATABASE = "CLINIC"

const getDeviceDescription = d => parse(d.userAgent)

const getGeoLocation = d => ({
    metadata: lookUp(d.latitude, d.longitude),
    country: (lookUpRaw(d.latitude, d.longitude)) ? lookUpRaw(d.latitude, d.longitude).features[0].properties.geonunit : "unknown",
    city: (lookUpRaw(d.latitude, d.longitude)) ? lookUpRaw(d.latitude, d.longitude).features[0].properties.name_en : "unknown"
})



const resolveStady = async patientId => {

    let stadies = await docdb.aggregate({
        db: DATABASE,
        collection: `sparrow-clinic.stadies`,
        pipeline: [
            { 
                $project: { 
                    _id: 0,
                } 
            }
        ]
    })
   log(`Available clinical stadies:`)
   log(stadies.map(s => `${s.name}: ${s.patientPrefixes.join(", ")}`))

   return find(stadies, stady => {
        const testExp = new RegExp(stady.patientPrefixes.map(p => `^${p}`).join("|"))
        log("TEST ", testExp, patientId, testExp.test(patientId)) 
        return testExp.test(patientId)
   })
}

const acceptData = async patientId => {
   let stady = await resolveStady(patientId)
   return !!stady
}

module.exports = {
    acceptData,
    resolveStady,
    getDeviceDescription,
    getGeoLocation
}

