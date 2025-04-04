const { extend, isArray, find, flatten } = require("lodash")
const fs = require("fs")

const processExamination = require("./1-import-process-examination")
const processRecord = require("./2-import-process-record")
const processTask = require("./3-import-process-task")

const CONFIG = require("./config")        


let data = flatten(CONFIG.sourceFiles.map( file => require(file)))



let examinations = processExamination(data)
let records = processRecord(data)
let tasks = processTask(records)


fs.writeFileSync(CONFIG.examinationsFile, JSON.stringify(examinations, null, " "))
fs.writeFileSync(CONFIG.labelsFile, JSON.stringify(records, null, " "))
fs.writeFileSync(CONFIG.tasksFile, JSON.stringify(tasks, null, " "))

