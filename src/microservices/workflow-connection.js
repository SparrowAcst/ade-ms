const axios = require("axios")
const { ADE_API } = require("../../.config/ade-import")

const WORKFLOW_ENDPOINT = `${ADE_API}/workflow/agents`

const getAgentList = async () => {
    try {

        result = await axios.get(WORKFLOW_ENDPOINT)
        result = result.data
        return result
    
    } catch(e) {
        console.log(WORKFLOW_ENDPOINT, e.toString())
        return []
    } 
}

module.exports = {
    getAgentList
}

// const run = async () => {
//     let agents = await getAgentList()
//     console.log(agents)    
// }

// run()