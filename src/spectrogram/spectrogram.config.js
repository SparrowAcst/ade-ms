
// const LABELING_COLLECTION = 'sparrow.clinic4'
// const LABELING_COLLECTION = 'sparrow.vinil'
// const LABELING_COLLECTION = 'sparrow.hha'
// const LABELING_COLLECTION = 'sparrow.innocent-reallife-labels'

// const LABELING_COLLECTION = 'sparrow.yoda'
// const LABELING_COLLECTION = 'sparrow.H2'
// const LABELING_COLLECTION = 'sparrow.H3'
const LABELING_COLLECTION = 'sparrow.taged-records'
const TASK_LIST = require("./spectrogram.tasklist")
const LIMIT = 100
const REFRESH_INTERVAL = 1 * 30 * 1000 // 1 min
const DATABASE_CLUSTER = "SPARROW"

module.exports = {
    LABELING_COLLECTION,
    LIMIT,
    REFRESH_INTERVAL,
    TASK_LIST,
    DATABASE_CLUSTER
}