const { keys, sortBy, groupBy, last, first, find, flatten } = require("lodash")
const path = require("path")
const fs = require("fs")
const { lookUp, lookUpRaw } = require("geojson-places")
const uuid = require("uuid").v4

const WORKDIR = "./Suspected Innocent from Reallife"
const DATA_FILE = `to_label_2024-12-20_innocent_murmurs-enriched_output.json`
const SELECTION_FILE = `to_label_2024-12-20_innocent_murmurs.json`

const saveJSON = ({ collection, data }) => {
    fs.writeFileSync(path.resolve(__dirname,`${WORKDIR}/${collection}.json`), JSON.stringify(data, null, " "))
}



const getActor = d => ({
    id: d.userId,
    firstName: d.userId,
    lastname: "",
    organization: orgId,
    userRole: d.userRole
})

let e = 0
const getExamination = d => {
    e++
    process.stdout.write(`${e}: exam: ${d.examinationId}                          ${'\x1b[0G'}`)    
    return {
        "id": d.examinationId,
        "dateTime": new Date(),
        "patientId": d.examinationId,
        "organization": orgId,
        "comment": d.notes,
        "state": "accepted",
        "type": null,
        "userId": d.userId,
        "org": "SPD",
        "synchronizedAt": new Date(),
        "actorId": d.userId,
        "updatedAt": new Date(),
        "updated at": new Date(),
        "Stage Comment": "",
        "updated by": "import utils",
        "siteId": orgId,
        "uuid": d.examinationId
    }
}

const getForms = d => {

    return [{
            "id": uuid(),
            "type": "attachements",
            "examinationId": d.examinationId,
            "data": [],
            "patientId": d.examinationId
        },
        {
            "id": uuid(),
            "submittedBy": d.userId,
            "type": "patient",
            "data": {
                "updatedBy": "",
                "uk": {},
                "en": {
                    age: d.examinationAge || -1,
                    weight: (d.examinationWeight) ? (d.examinationWeight > 200) ? d.examinationWeight/1000 : d.examinationWeight : undefined
                }
            },
            "examinationId": d.examinationId,
            "patientId": d.examinationId
        },
        {
            "id": uuid(),
            "submittedBy": d.userId,
            "type": "ekg",
            "data": {
                "updatedBy": "",
                "uk": {},
                "en": {}
            },
            "examinationId": d.examinationId,
            "patientId": d.examinationId
        },
        {
            "id": uuid(),
            "submittedBy": d.userId,
            "type": "echo",
            "data": {
                "updatedBy": "",
                "uk": {},
                "en": {}
            },
            "examinationId": d.examinationId,
            "patientId": d.examinationId
        }
    ]
}


getModel = s => {
    let r = s.split(" ")
    r.pop();
    r.pop();
    r.shift();
    return (r) ? r.map( d => first(d.split(","))).join(" ") : undefined 
}

getOsVersion = s => {
    try{
        let r = s.split(" ")
        r.pop()
        r = r.pop()
        r = (r) ? r.split(".").slice(0,2) : undefined
        return (r) ? r.join("."): undefined
    } catch(e) {
        console.log(s)
        throw e
    }    
}

let l = 0

const getLabels = d => {

    l++
    process.stdout.write(`${l}: labels: ${d.id}                          ${'\x1b[0G'}`)
    
    return {
        "id": d.id,
        assessmentRequired: d.assessmentRequired,
        // "Segmentation URL": `http://ec2-54-235-192-121.compute-1.amazonaws.com:8002/?record_v3=${d.path}&patientId=${d.patientId}&position=unknown&spot=unknown&device=unknown`,
        "path": `to_label_2024-12-20_innocent_murmurs-enriched_output/${d.id}.wav`,
        "Examination ID": d.examinationId,
        "Clinic": "SPD",
        "Age (Years)": d.examinationAge || -1,
        "Sex at Birth": "unknown",
        "Ethnicity": "unknown",
        "model": "Stethophone",
        "deviceDescription": {
            "userAgent": d.userAgent,
            model: getModel(d.userAgent),
            osVersion: getOsVersion(d.userAgent)
        },
        "geoLocation": {
            "latitude": d.latitude,
            "longitude": d.longitude,
            "metadata": lookUp(d.latitude, d.longitude),
            "country": (lookUpRaw(d.latitude, d.longitude)) ? lookUpRaw(d.latitude, d.longitude).features[0].properties.geonunit : "unknown" ,
            "city": (lookUpRaw(d.latitude, d.longitude)) ? lookUpRaw(d.latitude, d.longitude).features[0].properties.name_en: "unknown"
        },
        "Body Position": d.bodyPosition,
        "Body Spot": d.spot,
        "Systolic murmurs": [],
        "Diastolic murmurs": [],
        "Other murmurs": [],
        "Pathological findings": [],

        "state": "Assign 2nd expert",
        "CMO": "Yaroslav Shpak",
        "TODO": "Assign 2nd expert",
        "updated at": new Date(),
        "updated by": "import utils",
        "Stage Comment": "",
        "nextTodo": "Assign 2nd expert"
    }

}



let data = require(`${WORKDIR}/${DATA_FILE}`)
let selection = require(`${WORKDIR}/${SELECTION_FILE}`).map(d => d.id)

data
    .filter(d => selection.includes(d.id))
    .forEach(d => {
        d.assessmentRequired = true
    })

// data = data.slice(0, 50)

const orgId = uuid()

let examinationsData = groupBy(data, d => d.examinationId)
examinationsData = keys(examinationsData).map(key => examinationsData[key][0])

let actorsData = groupBy(data, d => d.userId)
actorsData = keys(actorsData).map(key => actorsData[key][0])




let dataset = {
    organizations: {
        collection: "innocent-reallife-organizations",
        data: [{
            id: orgId,
            name: "Stetophone Production Data"
        }]
    },
    examnations: {
        collection: "innocent-reallife-examinations",
        data: examinationsData.map(d => getExamination(d))
    },
    labels: {
        collection: "innocent-reallife-labels",
        data: data.map(d => getLabels(d))
    },
    forms: {
        collection: "innocent-reallife-forms",
        data: flatten(examinationsData.map(d => getForms(d)))
    },
    actors: {
        collection: "innocent-reallife-actors",
        data: actorsData.map(d => getActor(d))
    }

}



let collections = keys(dataset)
for(const collection of collections){
  saveJSON(dataset[collection])
}