const { extend, isArray, find } = require("lodash")

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

                let task = {
                    "workflowType": CONFIG.workflowType,
                    "agent": CONFIG.agent,
                    "dataCollection": "labels",
                    "savepointCollection": "savepoints",
                    "publisher": CONFIG.publisher,
                    "metadata": CONFIG.metadata,
                    "createdAt": new Date(),
                    "schema": CONFIG.schema,
                    "dataId": data.id,
                    "taskId": uuid(),
                    "workflowId": uuid(),
                }

                result.push(task)
            }
        }

        return result

    } catch (e) {

        log(e.toString(), e.stack)
        throw e
    }
}