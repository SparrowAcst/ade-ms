const { extend, isArray, find } = require("lodash")

const {
    getDeviceDescription,
    getGeoLocation
} = require("./data-utils")

const uuid = require("uuid").v4

const CONFIG = require("./config")

const mapSpot = spot => spot

module.exports = data => {

    try {
        let result = []
        let items = JSON.parse(JSON.stringify(data))
        items = (isArray(items)) ? items : [items]


        for (let data of items) {

            if (!find(result, d => d.id == data.id)) {

                let record = {
                    "id": data.id,
                    "Age (Years)": data.examinationAge,
                    "Sex at Birth": "unknown",
                    "Ethnicity": "unknown",
                    "model": "Stethophone",
                    "deviceDescription": getDeviceDescription(data),
                    "geoLocation": getGeoLocation(data),
                    "Body Position": data.bodyPosition,
                    "Body Spot": mapSpot(data.spot),
                    "Systolic murmurs": [],
                    "Diastolic murmurs": [],
                    "Other murmurs": [],
                    "Pathological findings": [],
                    "state": "Continue Labeling",
                    "examinationId": data.examinationId,
                    // "aiSegmentation": data.aiSegmentation,
                    "taskList": [],
                    "scheduledWorkflow": CONFIG.workflowType
                }


                result.push(record)
            }
        }

        return result

    } catch (e) {

        log(e.toString(), e.stack)
        throw e
    }
}