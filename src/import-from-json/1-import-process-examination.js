const { extend, isArray, find } = require("lodash")


const CONFIG = require("./config")        

module.exports = data => {

    try {
        let result = []

        let items = JSON.parse(JSON.stringify(data))
        items = (isArray(items)) ? items : [items]

        for (let data of items) {

            if(!find(result, d => d.id == data.examinationId)){
                let examination = {
                    "id": data.examinationId,
                    "siteId": CONFIG.siteId,
                    "protocol": "No Protocol",
                    "state": "accepted",
                    "comment": data.examinationTitle,
                    "forms": {
                        "patient": {
                            "type": "patient",
                            "data": {
                                "age": data.examinationAge,
                                "weight": data.examinationWeight,
                            }
                        },
                        "echo": {
                            "type": "echo",
                            "data": {}
                        },
                        "ekg": {
                            "type": "ekg",
                            "data": {}
                        },
                        "attachements": {
                            "type": "attachements",
                            "data": []
                        }
                    },
                    "updatedAt": new Date()
                }                   
                
                result.push(examination)
            }

        }

        return result

    } catch (e) {

        log(e.toString(), e.stack)
        throw e

    }
}

