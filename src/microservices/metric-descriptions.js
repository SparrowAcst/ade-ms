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
        let pool = flatten(data.map(d => d.taskList)).filter(d => d)map(d => {
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

            let t = groupBy(wf[wfkey], d => d.description.taskType)
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

    interval: [15, "seconds"],
    expired: [2, "hours"]
}

const deferredTasks = {
    name: "deferredTasks",
    query: {
        collection: "ADE-SETTINGS.deferred-tasks",
        pipeline: [{
            $project: {
                _id: 0,
            },
        }, ]
    },

    calculate: data => {

        let result = []
        let pool = data.map(d => {
            d.description = Key(d.data.key).getDescription()
            return d
        })

        result.push({
            workflow: "ALL",
            task: "ALL",
            count: pool.length
        })

        let wf = groupBy(pool, d => d.description.workflowType)

        keys(wf).forEach(wfkey => {

            result.push({
                workflow: wfkey,
                task: "ALL",
                count: wf[wfkey].length
            })

            let t = groupBy(wf[wfkey], d => d.description.taskType)
            keys(t).forEach(tkey => {
                result.push({
                    workflow: wfkey,
                    task: tkey,
                    count: t[tkey].length
                })

            })
        })

        let t = groupBy(pool, d => d.description.taskType)
        keys(t).forEach(tkey => {
            result.push({
                workflow: "ALL",
                task: tkey,
                count: t[tkey].length
            })

        })

        return result

    },

    out: {
        collection: "ADE-STATS.deferred-tasks"
    },

    interval: [15, "seconds"],
    expired: [2, "hours"]
}


const emittedTasks = {
    name: "emittedTasks",
    query: {
        collection: "ADE-SETTINGS.task-log",
        pipeline: [{
                $match: {
                    "metadata.status": "emitted"
                }
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]
    },

    calculate: data => {

        let result = []
        let pool = data.map(d => {
            d.description.emitter = d.metadata.emitter
            return d
        })

        result.push({
            workflow: "ALL",
            emitter: "ALL",
            count: pool.length
        })

        let wf = groupBy(pool, d => d.description.workflowType)

        keys(wf).forEach(wfkey => {

            result.push({
                workflow: wfkey,
                emitter: "ALL",
                count: wf[wfkey].length
            })

            let t = groupBy(wf[wfkey], d => d.description.emitter)
            keys(t).forEach(tkey => {
                result.push({
                    workflow: wfkey,
                    emitter: tkey,
                    count: t[tkey].length
                })

            })
        })

        let t = groupBy(pool, d => d.description.emitter)
        keys(t).forEach(tkey => {
            result.push({
                workflow: "ALL",
                emitter: tkey,
                count: t[tkey].length
            })

        })

        return result

    },

    out: {
        collection: "ADE-STATS.emitted-tasks"
    },

    interval: [15, "seconds"],
    expired: [2, "hours"]
}


const commitedTasks = {
    name: "commitedTasks",
    query: {
        collection: "ADE-SETTINGS.task-log",
        pipeline: [{
                $match: {
                    "metadata.status": "commit"
                }
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ]
    },

    calculate: data => {

        let result = []
        let pool = data.map(d => {
            d.description.emitter = d.metadata.emitter
            return d
        })

        result.push({
            workflow: "ALL",
            emitter: "ALL",
            count: pool.length
        })

        let wf = groupBy(pool, d => d.description.workflowType)

        keys(wf).forEach(wfkey => {

            result.push({
                workflow: wfkey,
                emitter: "ALL",
                count: wf[wfkey].length
            })

            let t = groupBy(wf[wfkey], d => d.description.emitter)
            keys(t).forEach(tkey => {
                result.push({
                    workflow: wfkey,
                    emitter: tkey,
                    count: t[tkey].length
                })

            })
        })

        let t = groupBy(pool, d => d.description.emitter)
        keys(t).forEach(tkey => {
            result.push({
                workflow: "ALL",
                emitter: tkey,
                count: t[tkey].length
            })

        })

        return result

    },

    out: {
        collection: "ADE-STATS.commited-tasks"
    },

    interval: [15, "seconds"],
    expired: [2, "hours"]
}


module.exports = [
    assignedTasks,
    deferredTasks,
    emittedTasks,
    commitedTasks
]