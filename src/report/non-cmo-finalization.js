const { find } = require("lodash")

module.exports = [

    // ////////////////////////////////////////////////////////////////////////////////////////

    // 	"PATIENTS. Non-significant murmur": [
    // 	  {
    // 	    $match:
    // 	      {
    // 	        "Systolic murmurs": {
    // 	          $elemMatch: {
    // 	            $regex: "Non-significant murmur",
    // 	          },
    // 	        },
    // 	      },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count:
    // 	      "count",
    // 	  },
    // 	],

    // 	"RECORDS. Non-significant murmur": [
    // 	  {
    // 	    $match:
    // 	      {
    // 	        "Systolic murmurs": {
    // 	          $elemMatch: {
    // 	            $regex: "Non-significant murmur",
    // 	          },
    // 	        },
    // 	      },
    // 	  },
    // 	  {
    // 	    $count:
    // 	      "count",
    // 	  },
    // 	],

    // //////////////////////////////////////////////////////////////////////////////////

    // 	"PATIENTS. Ejection type murmur. Certain non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Ejection Type Murmur",
    // 	          "Certain non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // 	"RECORDS. Ejection type murmur. Certain non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Ejection Type Murmur",
    // 	          "Certain non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // ////////////////////////////////////////////////////////////////////////////////////	

    // 	"PATIENTS. Ejection type murmur. Probable non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Ejection Type Murmur",
    // 	          "Probable non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],	

    // 	"RECORDS. Ejection type murmur. Probable non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Ejection Type Murmur",
    // 	          "Probable non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // /////////////////////////////////////////////////////////////////////////////////////	

    // 	"PATIENTS. Ejection type murmur. Undetermined significance": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Ejection Type Murmur",
    // 	          "Undetermined significance": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	], 

    // 	"RECORDS. Ejection type murmur. Undetermined significance": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Ejection Type Murmur",
    // 	          "Undetermined significance": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // /////////////////////////////////////////////////////////////////////////////////////

    // 	"PATIENTS. Midsystolic murmur. Certain non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Midsystolic murmur",
    // 	          "Certain non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // 	"RECORDS. Midsystolic murmur. Certain non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Midsystolic murmur",
    // 	          "Certain non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],


    // ////////////////////////////////////////////////////////////////////////////////////


    // 	"PATIENTS. Midsystolic murmur. Probable non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Midsystolic murmur",
    // 	          "Probable non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // 	"RECORDS. Midsystolic murmur. Probable non-significant": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Midsystolic murmur",
    // 	          "Probable non-significant": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // //////////////////////////////////////////////////////////////////////////////////////

    // 	"PATIENTS. Midsystolic murmur. Undetermined significance": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Midsystolic murmur",
    // 	          "Undetermined significance": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],


    // 	"RECORDS. Midsystolic murmur. Undetermined significance": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Midsystolic murmur",
    // 	          "Undetermined significance": true,
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    // //////////////////////////////////////////////////////////////////////////////////////

    // 	"PATIENTS. Systolic murmur undetermined": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Systolic murmur undetermined"
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $group: {
    // 	      _id: "$Examination ID",
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],


    // 	"RECORDS. Systolic murmur undetermined": [
    // 	  {
    // 	    $match: {
    // 	      "Systolic murmurs": {
    // 	        $elemMatch: {
    // 	          type: "Systolic murmur undetermined"
    // 	        },
    // 	      },
    // 	    },
    // 	  },
    // 	  {
    // 	    $count: "count",
    // 	  },
    // 	],

    ////////////////////////////////////////////////////////////////////////////////////////////////

    {
        feature: "RECORDS. Non-CMO Finalization",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $count: "count",
            },
        ],
        out: data => (data[0] && data[0].count) ? `${data[0].count}` : `-`
    },

    {
        feature: "Heart Sound Informativeness: Good; Heart Sound Informativeness:Poor;Heart Sound Informativeness: Uninformative;Heart Sound Informativeness: Non assessed;Heart Sound Informativeness: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $group: {
                    _id: "$Heart Sound Informativeness",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "Good",
                "Poor",
                "Uninformative",
                "Non assessed",
                null
            ]

            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "Lung Sound Informativeness: Good; Lung Sound Informativeness:Poor;Lung Sound Informativeness: Uninformative;Lung Sound Informativeness: Non assessed;Lung Sound Informativeness: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $group: {
                    _id: "$Lung Sound Informativeness",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "Good",
                "Poor",
                "Uninformative",
                "Non assessed",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },


    {
        feature: "S3: Certain;S3: Probable;S3: No;S3: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $group: {
                    _id: "$S3",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "Certain",
                "Probable",
                "No",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "S4: Certain;S4: Probable;S4: No;S4: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $group: {
                    _id: "$S4",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "Certain",
                "Probable",
                "No",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "Pathological findings: No Pathology;" +
            "Pathological findings: Ejection Sound;" +
            "Pathological findings: Additional Systolic Tones;" +
            "Pathological findings: Summation gallop;" +
            "Pathological findings: Additional Diastolic Tones;" +
            "Pathological findings: Pericardial Knock" +
            "Pathological findings: null;",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $unwind: {
                    path: "$Pathological findings",
                },
            },
            {
                $group: {
                    _id: "$Pathological findings",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "No Pathology",
                "Ejection Sound",
                "Additional Systolic Tones",
                "Summation gallop",
                "Additional Diastolic Tones",
                "Pericardial Knock",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "Rhythm and Arrhythmias: No arrhythmia;" +
            "Rhythm and Arrhythmias: Premature beats;" +
            "Rhythm and Arrhythmias: Atrial fibrillation;" +
            "Rhythm and Arrhythmias: Other arrhythmia;" +
            "Rhythm and Arrhythmias: Undefined Rhythm;" +
            "Rhythm and Arrhythmias: null",

        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $group: {
                    _id: "$Rhythm and Arrhythmias",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "No arrhythmia",
                "Premature beats",
                "Atrial fibrillation",
                "Other arrhythmia",
                "Undefined Rhythm",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "Systolic murmurs: No systolic murmurs;" +
            "Systolic murmurs: Systolic murmur undetermined;" +
            "Systolic murmurs: Ejection Type Murmur;" +
            "Systolic murmurs: Midsystolic murmur;" +
            "Systolic murmurs: Holosystolic Murmur;" +
            "Systolic murmurs: Late Systolic Murmur;" +
            "Systolic murmurs: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $unwind: {
                    path: "$Systolic murmurs",
                },
            },
            {
                $addFields: {
                    feature: {
                        $cond: [{
                                $eq: [{
                                        $type: "$Systolic murmurs.type",
                                    },
                                    "missing",
                                ],
                            },
                            "$Systolic murmurs",
                            "$Systolic murmurs.type",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$feature",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "No systolic murmurs",
                "Systolic murmur undetermined",
                "Ejection Type Murmur",
                "Midsystolic murmur",
                "Holosystolic Murmur",
                "Late Systolic Murmur",
                // "Non-significant murmur",
                // "Still's Murmur",
                // "Undetermined murmur significance",
                // "Unstable systolic murmur",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "Diastolic murmurs: No diastolic murmurs;" +
            "Diastolic murmurs: Diastolic High Frequency Murmur;" +
            "Diastolic murmurs: Austin Flint murmur;" +
            "Diastolic murmurs: Diastolic Low Frequency Murmur;" +
            "Diastolic murmurs: Late diastolic murmur;" +
            "Diastolic murmurs: Diastolic Murmur Other;" +
            "Diastolic murmurs: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $unwind: {
                    path: "$Diastolic murmurs",
                },
            },
            {
                $addFields: {
                    feature: {
                        $cond: [{
                                $eq: [{
                                        $type: "$Diastolic murmurs.type",
                                    },
                                    "missing",
                                ],
                            },
                            "$Diastolic murmurs",
                            "$Diastolic murmurs.type",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$feature",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "No diastolic murmurs",
                "Diastolic High Frequency Murmur",
                "Austin Flint murmur",
                "Diastolic Low Frequency Murmur",
                "Late diastolic murmur",
                "Diastolic Murmur Other",

                // "Unstable diastolic murmur",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    {
        feature: "Other murmurs: No Other Murmurs;" +
            "Other murmurs: Constant Murmur;" +
            "Other murmurs: Pericardial Friction Rub;" +
            "Other murmurs: Venous Hum;" +
            "Other murmurs: null",
        pipeline: [{
                $match: {
                    "Body Spot": {
                        $in: [
                            "Apex",
                            "Tricuspid",
                            "Pulmonic",
                            "Aortic",
                            "Right Carotid",
                            "Left Carotid",
                            "Erb's",
                            "Erb's Right",
                        ],
                    },
                    TODO: "Finalized",
                    "updated by": {
                        $ne: "Yaroslav Shpak",
                    },
                },
            },
            {
                $unwind: {
                    path: "$Other murmurs",
                },
            },
            {
                $addFields: {
                    feature: {
                        $cond: [{
                                $eq: [{
                                        $type: "Other murmurs.type",
                                    },
                                    "missing",
                                ],
                            },
                            "$Other murmurs",
                            "$Other murmurs.type",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: "$feature",
                    count: {
                        $count: {},
                    },
                },
            },
        ],
        out: data => {
            const values = [
                "No Other Murmurs",
                "Constant Murmur",
                "Pericardial Friction Rub",
                "Venous Hum",
                null
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },




]