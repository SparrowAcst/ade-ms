forms

[
  {
    $match: {
      $or: [
        {
          type: "patient",
          "data.en.diagnosisTags.tags": {
            $in: [
              "a06bde24-45ee-455c-949a-9166bdb9e73d",
              "933e3eef-e5d2-4bc5-adaa-0547feebbeca",
              "197cd6b2-0fae-42e5-8cb6-6393352e8554",
              "9b7503c5-8605-4e29-88ac-a86145d3fb72",
              "7e989f9d-0df5-4b0e-b4a7-e909d9fbc9c2",
              "3d243f6c-dae6-4034-b357-f0c3a508196b",
              "186c2ea5-72e6-4903-aa31-3d16eef7ed0f",
              "b7b2d246-ff4c-4904-b2c3-f38d2cec145a",
              "c4659019-ec37-434a-b07d-a0488c3910ec",
              "8d5cbfaa-ba6e-47d0-b28b-779f6b1a0bca",
              "8a06ad96-6e98-4442-8182-07b72db37a2a",
              "be640f98-6015-4e22-8c9e-709ff077c568",
              "43beb402-a0cd-4006-b161-6b5f3866e076",
              "4303e5ac-2182-4e18-bb34-792353d15edb",
              "fc5d3aa3-92ca-4363-b9fb-45b6ae43d75d",
              "166e0617-dd6b-476e-84ea-fa0efba74f22",
              "1d1f1940-7ede-4a68-a77e-a52e27a8c607-1",
              "734fbc39-7af8-4d78-944e-a6b1f23d0cd1",
              "2f5a3a7c-5d1d-4c1a-bd9a-6844f2447be3",
              "e075cced-efd4-45fa-97f8-d3123b2e1dce",
              "6a4ecf59-063d-486b-b487-cbf623e631fe",
              "9a3c1640-f6d6-4903-ae6e-41ee0ed32f41",
              "3832a93f-5761-4680-9a17-e03f92986d50",
              "a6ebbb61-ba56-40a6-b019-254443d508f6",
              "ec1b284d-259c-4284-ae32-91ebea9dff5f",
              "5ab4ec3b-b365-4b24-b70e-ca093e6399d0",
              "9692228d-4fc7-4ac0-97d3-b54f0d73a2ff",
              "278a174c-e551-4d2f-bf2b-756889ec5b3b",
              "fe6c8110-7d43-45cf-ae88-9d93e2097dc1",
              "75e0b996-3eeb-4e6d-8e61-b0566e03d42c",
            ],
          },
        },
        {
          type: "echo",
          $or: [
            {
              "data.en.mitral_regurgitation_1":
                "Present",
              "data.en.mitral_regurgitation_stage":
                {
                  $in: [
                    "A At risk of MR",
                    "B Progressive",
                  ],
                },
            },
            {
              "data.en.mitral_stenosis":
                "Present",
              "data.en.mitral_stenosis_stage":
                "A At rick for MS",
            },
            {
              "data.en.aortic_valve": {
                $in: [
                  "Consolidated",
                  "Calcification",
                ],
              },
            },
            {
              "data.en.aortic_regurgitation":
                "Present",
              "data.en.aortic_regurgitation_stage":
                {
                  $in: [
                    "A At risk of AR",
                    "B Progressive Mild AR",
                    "B Progressive Moderate AR",
                  ],
                },
            },
            {
              "data.en.aortic_stenosis":
                "Present",
              "data.en.aortic_stenosis_stage": {
                $in: [
                  "A - At risk of AS",
                  "B - Progressive mild",
                  "B - Progressive moderate",
                ],
              },
            },
            {
              "data.en.tricuspid_regurgitation":
                "Present",
              "data.en.tricuspid_regurgitation_stage":
                {
                  $in: [
                    "B - Progressive TR Moderate",
                  ],
                },
            },
            {
              "data.en.pulmonary_regurgitation":
                "Present",
              "data.en.pulmonary_regurgitation_stage":
                {
                  $in: ["Moderate"],
                },
            },
            {
              "data.en.valve_prostheses":
                "Present",
            },
            {
              "data.en.heart_diseases": {
                $elemMatch: {
                  $eq: "Atrial Septal Defect",
                },
              },
            },
          ],
        },
      ],
    },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$patientId",
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
        patientId: {
          $push: "$_id",
        },
      },
  },
]


records

[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
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
        "updated by": "Yaroslav Shpak",
      },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$Examination ID",
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
        patientId: {
          $push: "$_id",
        },
      },
  },
]
















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        type: "patient",
        "data.en.diagnosisTags.finalized": true,
        "data.en.diagnosisTags.createdBy.name":
          "Yaroslav Shpak",
      },
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "H2",
        localField: "patientId",
        foreignField: "Examination ID",
        as: "records",
        pipeline: [
          {
            $match: {
              "Systolic murmurs": {
                $elemMatch: {
                  $regex: "Non",
                },
              },
            },
          },
        ],
      },
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$records",
      },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$records.id",
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
        records: {
          $push: "$_id",
        },
      },
  },
]

///////////////////////////////////////////////////////////////////


{
  "_id": "H2",
  "records": [
    "bfd4d5ad-2c56-4910-a400-92f58195e2d4",
    "68040874-1e3c-4a5e-aadd-c29cdbcf5ebc",
    "21413d3d-0046-40da-8607-df0c6fbf4fd1",
    "2aba02f3-e882-447d-9c25-5987ba92b8a6",
    "119c879e-6a6b-4739-83ec-6fd3af9ada50",
    "0fb3ca13-1e4d-4929-a456-9a6295da1ad4"
  ]
}

{
  "_id": "harvest1-upd",
  "records": [
    "95072c18-a5a5-4ea7-b7aa-dac986d2f13a",
    "3faf7ee5-0e53-4256-a6c7-6b3f4bf802f0",
    "d81a5bb2-6ea0-4587-850e-e85cd0807c74",
    "f22c333b-5287-46a8-9bdb-8e9354b458c8",
    "455183c3-8bc4-4f56-8de0-5440510c32c5"
  ]
}

