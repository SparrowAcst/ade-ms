const { keys, sortBy } = require("lodash")

const docdb = require("./docdb")
const db = "SPARROW" 

const datasets = {
	"Heart Harvest 1" : "sparrow.harvest1-upd",
	"Heart Harvest 2" : "sparrow.H2",
	"Heart Harvest 3" : "sparrow.H3",
	"Heart Harvest America": "sparrow.hha",
	"ARABIA": "sparrow.arabia-labels",
	"Clinic4": "sparrow.clinic4",
	"Digiscope": "sparrow.digiscope",
	"Suspected Innocent from Reallife": "sparrow.innocent-reallife-labels",
	"Phisionet": "sparrow.phisionet",
	"Phonendo": "sparrow.phonendo",
	"Tagged records": "sparrow.taged-records",
	"Vinil": "sparrow.vinil",
	"Vintage": "sparrow.vintage",
	"YODA": "sparrow.yoda"

}


const queries = {

////////////////////////////////////////////////////////////////////////////////////////

	"PATIENTS. Non-significant murmur": [
	  {
	    $match:
	      {
	        "Systolic murmurs": {
	          $elemMatch: {
	            $regex: "Non-significant murmur",
	          },
	        },
	      },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count:
	      "count",
	  },
	],

	"RECORDS. Non-significant murmur": [
	  {
	    $match:
	      {
	        "Systolic murmurs": {
	          $elemMatch: {
	            $regex: "Non-significant murmur",
	          },
	        },
	      },
	  },
	  {
	    $count:
	      "count",
	  },
	],

//////////////////////////////////////////////////////////////////////////////////
	
	"PATIENTS. Ejection type murmur. Certain non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Ejection Type Murmur",
	          "Certain non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	],

	"RECORDS. Ejection type murmur. Certain non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Ejection Type Murmur",
	          "Certain non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],

////////////////////////////////////////////////////////////////////////////////////	

	"PATIENTS. Ejection type murmur. Probable non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Ejection Type Murmur",
	          "Probable non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	],	

	"RECORDS. Ejection type murmur. Probable non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Ejection Type Murmur",
	          "Probable non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],

/////////////////////////////////////////////////////////////////////////////////////	

	"PATIENTS. Ejection type murmur. Undetermined significance": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Ejection Type Murmur",
	          "Undetermined significance": true,
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	], 

	"RECORDS. Ejection type murmur. Undetermined significance": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Ejection Type Murmur",
	          "Undetermined significance": true,
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],

/////////////////////////////////////////////////////////////////////////////////////

	"PATIENTS. Midsystolic murmur. Certain non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Midsystolic murmur",
	          "Certain non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	],

	"RECORDS. Midsystolic murmur. Certain non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Midsystolic murmur",
	          "Certain non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],


////////////////////////////////////////////////////////////////////////////////////


	"PATIENTS. Midsystolic murmur. Probable non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Midsystolic murmur",
	          "Probable non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	],

	"RECORDS. Midsystolic murmur. Probable non-significant": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Midsystolic murmur",
	          "Probable non-significant": true,
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],

//////////////////////////////////////////////////////////////////////////////////////

	"PATIENTS. Midsystolic murmur. Undetermined significance": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Midsystolic murmur",
	          "Undetermined significance": true,
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	],


	"RECORDS. Midsystolic murmur. Undetermined significance": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Midsystolic murmur",
	          "Undetermined significance": true,
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],

//////////////////////////////////////////////////////////////////////////////////////

	"PATIENTS. Systolic murmur undetermined": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Systolic murmur undetermined"
	        },
	      },
	    },
	  },
	  {
	    $group: {
	      _id: "$Examination ID",
	    },
	  },
	  {
	    $count: "count",
	  },
	],


	"RECORDS. Systolic murmur undetermined": [
	  {
	    $match: {
	      "Systolic murmurs": {
	        $elemMatch: {
	          type: "Systolic murmur undetermined"
	        },
	      },
	    },
	  },
	  {
	    $count: "count",
	  },
	],


}


const run = async () => {
	let datasetNames = sortBy(keys(datasets))
	console.log(datasetNames)
	let featuresNames = keys(queries)
	let index = 0
	let report = []


		const titles = [
		"No.",
		"Dataset",
		
		"PATIENTS. Non-significant murmur",
		"RECORDS. Non-significant murmur",
		
		"PATIENTS. Ejection type murmur. Certain non-significant",
		"RECORDS. Ejection type murmur. Certain non-significant",
		
		"PATIENTS. Ejection type murmur. Probable non-significant",
		"RECORDS. Ejection type murmur. Probable non-significant",
		
		"PATIENTS. Ejection type murmur. Undetermined significance",
		"RECORDS. Ejection type murmur. Undetermined significance",
		
		"PATIENTS. Midsystolic murmur. Certain non-significant",
		"RECORDS. Midsystolic murmur. Certain non-significant",

		"PATIENTS. Midsystolic murmur. Probable non-significant",
		"RECORDS. Midsystolic murmur. Probable non-significant",

		"PATIENTS. Midsystolic murmur. Undetermined significance",
		"RECORDS. Midsystolic murmur. Undetermined significance",

		"PATIENTS. Systolic murmur undetermined",
		"RECORDS. Systolic murmur undetermined"

	]

	console.log(titles.join(";"))



	for(let datasetName of datasetNames){
		
		index++
		res = {
			"No.": index,
			"Dataset": datasetName
		}
		
		for( featureName of featuresNames){
			// process.stdout.write(`${datasetName}:  ${featureName}                                         ${'\x1b[0G'}`)
			res[featureName] = await docdb.aggregate({
				db,
				collection: datasets[datasetName],
				pipeline: queries[featureName]
			})

			res[featureName] = (res[featureName][0] && res[featureName][0].count) ? res[featureName][0].count : 0

		}

		console.log(titles.map( t => res[t]).join(";"))
		report.push(res)

	}


	// report.forEach( row => {
	// 	console.log(titles.map( t => row[t]).join(";"))
	// })

}


run()	