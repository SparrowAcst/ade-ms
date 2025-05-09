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

    // {
    //     feature: "RECORDS. Non-CMO Finalization",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $count: "count",
    //         },
    //     ],
    //     out: data => (data[0] && data[0].count) ? `${data[0].count}` : `-`
    // },

    // {
    //     feature: "Heart Sound Informativeness: Good; Heart Sound Informativeness:Poor;Heart Sound Informativeness: Uninformative;Heart Sound Informativeness: Non assessed;Heart Sound Informativeness: null",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$Heart Sound Informativeness",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "Good",
    //             "Poor",
    //             "Uninformative",
    //             "Non assessed",
    //             null
    //         ]

    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },

    // {
    //     feature: "Lung Sound Informativeness: Good; Lung Sound Informativeness:Poor;Lung Sound Informativeness: Uninformative;Lung Sound Informativeness: Non assessed;Lung Sound Informativeness: null",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$Lung Sound Informativeness",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "Good",
    //             "Poor",
    //             "Uninformative",
    //             "Non assessed",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },


    // {
    //     feature: "S3: Certain;S3: Probable;S3: No;S3: null",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$S3",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "Certain",
    //             "Probable",
    //             "No",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },

    // {
    //     feature: "S4: Certain;S4: Probable;S4: No;S4: null",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$S4",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "Certain",
    //             "Probable",
    //             "No",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },

    // {
    //     feature: "Pathological findings: No Pathology;" +
    //         "Pathological findings: Ejection Sound;" +
    //         "Pathological findings: Additional Systolic Tones;" +
    //         "Pathological findings: Summation gallop;" +
    //         "Pathological findings: Additional Diastolic Tones;" +
    //         "Pathological findings: Pericardial Knock" +
    //         "Pathological findings: null;",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $unwind: {
    //                 path: "$Pathological findings",
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$Pathological findings",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "No Pathology",
    //             "Ejection Sound",
    //             "Additional Systolic Tones",
    //             "Summation gallop",
    //             "Additional Diastolic Tones",
    //             "Pericardial Knock",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },

    // {
    //     feature: "Rhythm and Arrhythmias: No arrhythmia;" +
    //         "Rhythm and Arrhythmias: Premature beats;" +
    //         "Rhythm and Arrhythmias: Atrial fibrillation;" +
    //         "Rhythm and Arrhythmias: Other arrhythmia;" +
    //         "Rhythm and Arrhythmias: Undefined Rhythm;" +
    //         "Rhythm and Arrhythmias: null",

    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$Rhythm and Arrhythmias",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "No arrhythmia",
    //             "Premature beats",
    //             "Atrial fibrillation",
    //             "Other arrhythmia",
    //             "Undefined Rhythm",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },

    {
        feature: "Systolic murmurs: No systolic murmurs;" +
            "Systolic murmurs: Systolic murmur undetermined;" +
            "Systolic murmurs: Ejection Type Murmur;" +
            "Systolic murmurs: Midsystolic murmur;" +
            "Systolic murmurs: Holosystolic Murmur;" +
            "Systolic murmurs: Late Systolic Murmur;" +
            "Systolic murmurs: null;"+
            "Systolic murmurs: Non-significant murmur;"+
            "Systolic murmurs: Still's Murmur;"+
            "Systolic murmurs: Undetermined murmur significance;"+
            "Systolic murmurs: Unstable systolic murmur",
            
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
                null,
                "Non-significant murmur",
                "Still's Murmur",
                "Undetermined murmur significance",
                "Unstable systolic murmur",
                
            ]
            return values.map(v => {
                const f = find(data, d => d._id == v)
                return (f) ? f.count : "-"
            }).join(";")
        }
    },

    // {
    //     feature: "Diastolic murmurs: No diastolic murmurs;" +
    //         "Diastolic murmurs: Diastolic High Frequency Murmur;" +
    //         "Diastolic murmurs: Austin Flint murmur;" +
    //         "Diastolic murmurs: Diastolic Low Frequency Murmur;" +
    //         "Diastolic murmurs: Late diastolic murmur;" +
    //         "Diastolic murmurs: Diastolic Murmur Other;" +
    //         "Diastolic murmurs: null",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $unwind: {
    //                 path: "$Diastolic murmurs",
    //             },
    //         },
    //         {
    //             $addFields: {
    //                 feature: {
    //                     $cond: [{
    //                             $eq: [{
    //                                     $type: "$Diastolic murmurs.type",
    //                                 },
    //                                 "missing",
    //                             ],
    //                         },
    //                         "$Diastolic murmurs",
    //                         "$Diastolic murmurs.type",
    //                     ],
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$feature",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "No diastolic murmurs",
    //             "Diastolic High Frequency Murmur",
    //             "Austin Flint murmur",
    //             "Diastolic Low Frequency Murmur",
    //             "Late diastolic murmur",
    //             "Diastolic Murmur Other",

    //             // "Unstable diastolic murmur",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },

    // {
    //     feature: "Other murmurs: No Other Murmurs;" +
    //         "Other murmurs: Constant Murmur;" +
    //         "Other murmurs: Pericardial Friction Rub;" +
    //         "Other murmurs: Venous Hum;" +
    //         "Other murmurs: null",
    //     pipeline: [{
    //             $match: {
    //                 "Body Spot": {
    //                     $in: [
    //                         "Apex",
    //                         "Tricuspid",
    //                         "Pulmonic",
    //                         "Aortic",
    //                         "Right Carotid",
    //                         "Left Carotid",
    //                         "Erb's",
    //                         "Erb's Right",
    //                     ],
    //                 },
    //                 TODO: "Finalized",
    //                 "updated by": {
    //                     $ne: "Yaroslav Shpak",
    //                 },
    //             },
    //         },
    //         {
    //             $unwind: {
    //                 path: "$Other murmurs",
    //             },
    //         },
    //         {
    //             $addFields: {
    //                 feature: {
    //                     $cond: [{
    //                             $eq: [{
    //                                     $type: "Other murmurs.type",
    //                                 },
    //                                 "missing",
    //                             ],
    //                         },
    //                         "$Other murmurs",
    //                         "$Other murmurs.type",
    //                     ],
    //                 },
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: "$feature",
    //                 count: {
    //                     $count: {},
    //                 },
    //             },
    //         },
    //     ],
    //     out: data => {
    //         const values = [
    //             "No Other Murmurs",
    //             "Constant Murmur",
    //             "Pericardial Friction Rub",
    //             "Venous Hum",
    //             null
    //         ]
    //         return values.map(v => {
    //             const f = find(data, d => d._id == v)
    //             return (f) ? f.count : "-"
    //         }).join(";")
    //     }
    // },




]

















/////////////////////////////////////////////////////////////////////////////////////////////


[
	{
	  "_id": "H2",
	  "scenario: 1",
	  "id": [
	    "f0f20571-1a2a-4714-a9e9-3fc4f32e78e2",
	    "7cd56d82-78de-45f6-89f6-b4e544452de0",
	    "2987ebd8-df64-491f-b515-978a28278053",
	    "532d39ff-c28c-4a9a-9dfc-8c8b2c81ceff",
	    "05c0e78d-f57f-4566-9f4f-501cf2461467",
	    "8ea2bc19-d569-4c6d-ab02-124e3a8c3010",
	    "6dbfe7f8-da66-4973-9eaf-eacf63eef4cd",
	    "ab98cec9-16a1-4e7a-bcd7-5599f2229625",
	    "a9a5695e-f50f-491d-93a2-14d5cb71602f",
	    "c8bf20a6-739b-415f-8041-9c6f0b280588",
	    "d53f5e67-ca2b-4111-ac62-cfdddca8f19a",
	    "7171ed8e-c9a8-469a-9124-dcce26e7d560",
	    "ecc3ac51-422b-4236-8e24-9bdbfc8247af",
	    "11e656f5-f6d8-418b-afdb-55144facf07c",
	    "cf0c5ad7-875a-498d-a52c-fbd9504f8ead",
	    "2bf5edc5-f660-4943-ac4d-a4c8f937a54d",
	    "ccac5e8d-1dde-4e5a-86fc-0ef720d39aaf",
	    "0c447d1a-9156-4de1-ac41-87370b37fa0c",
	    "141a459e-cc08-477d-925f-7c2f55572523",
	    "0dd092a6-24a6-4ba2-bf3e-e2c6fab1cb1c",
	    "43e93e13-3a8c-425e-9404-ec796bd6fca4",
	    "eb966f6a-3f76-4ef8-9822-a9d5a433f8c3",
	    "66a8a6a0-dd60-4c3d-afb7-c9e3a11b6484",
	    "d8f3c04e-0065-498f-8980-5fe6832d71d3"
	  ]
	},





]


 {
      "type": "Ejection Type Murmur",
      "Probable non-significant": true
 }

scenario 2 qury

[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        "Systolic murmurs": {
          $elemMatch: {
            type: {
              $in: [
                "Ejection Type Murmur",
                "Midsystolic murmur",
              ],
            },
            $or: [
              {
                "Certain non-significant": {
                  $exists: true,
                },
              },
              {
                "Probable non-significant": {
                  $exists: true,
                },
              },
              {
                "Undetermined significance": {
                  $exists: true,
                },
              },
            ],
          },
        },
      },
  },
  {
    $match: {
      "Systolic murmurs": {
        $elemMatch: {
          $eq: "Non-significant murmur",
        },
      },
    },
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        _id: 0,
        id: 1,
      },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "1",
        id: {
          $push: "$id",
        },
      },
  },
]