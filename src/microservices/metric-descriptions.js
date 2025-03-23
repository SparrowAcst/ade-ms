const moment = require("moment")
const { extend, flatten, groupBy, keys } = require("lodash")
const log = require("../utils//logger")(__filename)
const docdb = require("../utils/docdb")
const config = require("../../.config/ade-import")
const Key = require("../utils/task-key")

const assignedTasks = {
    name: "assignedTasks",
    query: {
        collection: "ADE-SETTINGS.app-grants",
        pipeline: [{
                $match: {
                    schedule: {
                        $exists: true,
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    user: "$namedAs",
                    taskList: 1,
                },
            },
        ]
    },

    calculate: data => {

        let result = []
        let pool = flatten(data.map(d => d.taskList)).map(d => {
            d.description = Key(d.key).getDescription()
            return d
        })

        result.push({
            workflow: "ALL",
            task: "ALL",
            user: "ALL",
            count: pool.length
        })

        let wf = groupBy(pool, d => d.description.workflowType)

        keys(wf).forEach(wfkey => {

            result.push({
                workflow: wfkey,
                task: "ALL",
                user: "ALL",
                count: wf[wfkey].length
            })

            let t = groupBy(wf[key], d => d.description.taskType)
            keys(t).forEach(tkey => {
                result.push({
                    workflow: wfkey,
                    task: tkey,
                    user: "ALL",
                    count: t[tkey].length
                })

                let u = groupBy(t[tkey], d => d.user)
                keys(u).forEach(ukey => {
                    result.push({
                        workflow: wfkey,
                        task: tkey,
                        user: ukey,
                        count: u[ukey].length
                    })

                })

            })

        })

        let t = groupBy(pool, d => d.description.taskType)
        keys(t).forEach(tkey => {
            result.push({
                workflow: "ALL",
                task: tkey,
                user: "ALL",
                count: t[tkey].length
            })

            let u = groupBy(t[tkey], d => d.user)
            keys(u).forEach(ukey => {
                result.push({
                    workflow: "ALL",
                    task: tkey,
                    user: ukey,
                    count: u[ukey].length
                })

            })

        })

        let u = groupBy(pool, d => d.user)
        keys(u).forEach(ukey => {
            result.push({
                workflow: "ALL",
                task: "ALL",
                user: ukey,
                count: u[ukey].length
            })

        })

        return result

    },

    out: {
        collection: "ADE-STATS.assigned-tasks"
    },

    interval: [5, "seconds"],
    expired: [1, "hours"]
}


module.exports = [
    assignedTasks
]