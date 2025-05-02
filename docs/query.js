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





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{
  "_id": "H2",
  "records": [
    "eXjIH9Xmi7x5Sy0HkIaL",
    "PLyZX3hrgrfssb7FW4QM",
    "M1ybrKiYvyB0AIGTOUPw",
    "tUx8MEW6HhmDNu17dBBg",
    "WXENSUICTAcdEQKTEi5B",
    "dZh17dJbhmErGHJCzJSH",
    "Fk82SdkUwJVGt5dPkALZ",
    "FoBkOfhnrH8GSFVWw3Ie",
    "pDCTDr7QQakJllR6dyqE",
    "cuXeCoVoBgB81mRE6diN",
    "Lh3t4hFyVuYYboTgnGzq",
    "HsSdiXipG0xqdD7chd99",
    "qCB0ulE7UrkDW8Oe3I7T",
    "4GFA6xTilUs8C5Od5crt",
    "C0bohXwEv9So7pFbzhHr",
    "RUO5bwWME99ZJ8onmXJV",
    "O3yvuN81kWlO9O5N4f1i",
    "NUwMEy5mrvU0203COK8C",
    "XT6ryUa36E5wTfsBSjgK",
    "GbvN5gV9ePwwPovdDvA7",
    "iZZoNzlqzycltgaQ18uf",
    "7LKfUkkbsP6cXQBOMntB",
    "1u0sQtYrsLqk6wRH5ake",
    "zOTiWBI0slxo0NKdQyxj",
    "s1NlH91m99pRuVaqwdKg",
    "IXRZNbfmVn3mKwFW5TWc",
    "CXstmcOGVFFp6e9yS7O6",
    "f9yJ342wnyeYG9uCB0Da",
    "rglkOJ7XxsgzZc91kuuW",
    "yPHUWEEEaToFxQ2xJpyg",
    "KybGz7mn0KmkWXUy4DQk",
    "ck4JsX1PS3cNB7QyIDIS",
    "oy9IF35mAD2mzlIAyiKQ",
    "gADHTMqELM02R9gas3Jb",
    "SaDDhorW6vw9Epr3K6Vy",
    "fTdak59hBuKwlCOLbuNY",
    "Wk2fsAi83BoV7b1NInyv",
    "iu8EDt0iUjNuOkmlPtN0",
    "tzEarx2mDb4V7HsHjQai",
    "wbGakM2gMBlcwEWNFmWQ",
    "2l6XETNIHFgglile27z2",
    "hDY451qlTBYTOGFOSNKC",
    "pLlrKWdd39Zr5Yqwqrnn",
    "VSb0ULAsoPuRe65xwvBK",
    "sRsuZNQ5esy8OGjDhp7J",
    "uTnMhF02rsdkrsowCzIY",
    "o5upXVvynWZMsKOCI8Jg",
    "DBja5mrcGcVc2i6fzvTr",
    "wKH3jRkXgzm1Pf1KZzfm",
    "4qJQTo6GNFrLxAuLEVt5",
    "ycS6IMS5Rlj3EDUSiwP8",
    "rbhxV5FvIx8NwoUBxSgj",
    "cfhmWb2vwyTEUighJO5z",
    "NEzLpVetWedKyXw46xaQ",
    "ZAjoverZK0hFyWPmjRQF",
    "nsbjkh3mRBnHGDelVUrI",
    "H26JGbh2ZOUCiuuAZKip",
    "VJm73wAA8GKmBqgZ3u07",
    "qH3laC6gqyYFCXHETRtS",
    "IkgOpohgsQwQOjO5eiN3",
    "B9lTrVD7QsFJlQ98WVqG",
    "hruHsOyuncPizb1niGQa",
    "gsp4uvFdWafvY3Y6qKtr",
    "3T7DxNl8iyyseMit36so",
    "Gup2FcuCjaCwVJZtoLsx",
    "6WnHOXJTbR1viMfac5a3",
    "mp7aDNLXJVd0m1Jt3o7D",
    "lrJ8jRAtehBQEvOFQPao",
    "GykaCq84tONNIXRiPlbb",
    "A1dTxH8NLrrzjavOIJ5O",
    "YQaHe105oLffmEXED8Zz",
    "QrB7hLTPW5TFu9jT4rVg"
  ]
}




[
  {
    $match: {
      "Systolic murmurs": {
        $elemMatch: {
          $regex: "Non",
        },
      },
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
        from: "digiscope-exams",
        localField: "Examination ID",
        foreignField: "patientId",
        as: "result",
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
        examinationId: {
          $first: "$result.id",
        },
      },
  },
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$examinationId",
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
        from: "digiscope-forms",
        localField: "_id",
        foreignField: "examinationId",
        as: "result",
        pipeline: [
          {
            $match: {
              type: "patient",
            },
          },
          {
            $match: {
              $nor: [
                {
                  type: "patient",
                  "data.en.diagnosisTags.finalized": true,
                  "data.en.diagnosisTags.createdBy.name":
                    "Yaroslav Shpak",
                },
              ],
            },
          },
        ],
      },
  },
  // {
  //   $count:
  //     /**
  //      * Provide the field name for the count.
  //      */
  //     "string",
  // }
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        $nor: [
          {
            result: {
              $size: 0,
            },
          },
        ],
      },
  },
  // {
  //   $project:
  //     /**
  //      * specifications: The fields to
  //      *   include or exclude.
  //      */
  //     {
  //       _id: 0,
  //       id: "$_id",
  //     },
  // }
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "digiscope",
        id: {
          $push: "$_id",
        },
      },
  },
  // {
  //   $count:
  //     /**
  //      * Provide the field name for the count.
  //      */
  //     "string",
  // }
]


{
  "_id": "yoda",
  "id": [
    "2c358df4-4de4-410c-8c3b-325dd4d18e6d",
    "1abef821-ad3f-4022-a760-09b19a282c74",
    "d0d8d000-d340-4c4e-ae82-c268ef43c7d4",
    "34dc6cc4-679e-442e-8d15-8d8b9b3afcba",
    "3e3e1b04-e2d9-4884-a2db-0f16553b1a7a",
    "436c2fbf-5694-4774-b133-b13b0ed7e3d4",
    "ee3795c4-0608-4dc0-a213-e35333be2d81",
    "e309de0e-5b24-436d-a35b-6a66ba739fb0",
    "1c1e92d6-b022-434f-b5aa-e495e946bea1",
    "eabe804a-fefe-46db-9e1e-325a0b5b1a59",
    "941a4b68-4991-46bb-9e38-2e5dcd0e4b01",
    "ab6a09ec-9c78-4edc-a5fd-fbe284d757a7",
    "c29e5cf7-c645-42c5-b2cf-2304c9543a70",
    "b4f1def1-c9c1-4071-b35a-946fc8fdac2e",
    "c1f26749-1aa5-46cb-bc6b-c3e29911e2a8",
    "2e79c917-8c64-4869-9f52-21ba5804a2fe",
    "6b820b8d-30f5-4af9-b2e4-c81837e631c3",
    "22eed46f-aee4-4e7a-8f29-ac9754c249a4",
    "343b9bcc-b2fa-4615-a762-6ca8b04322c4",
    "589624cb-34c1-4057-9875-1dae596b8576",
    "51f401f2-d802-478f-a389-caeee89f8bf1",
    "1a3fe8b4-3097-4dc2-98a4-c97dda4bf31c",
    "3b8e4df9-8e89-4a32-b560-d1a974c71dac",
    "e1548ee5-c6c1-4964-8b0c-50b6cb5aca47",
    "2717f86c-65a4-4ddd-bd37-01102561b449",
    "5ba9865d-a65f-4ebc-88c0-379bf6fa93a1",
    "cf76e949-ced8-40be-8ddc-671515eefcbc",
    "d9869afc-dcd7-4016-964f-5f98127706df",
    "a65ade5c-d0d5-46f6-bc1e-2d275a7924a7",
    "7cb37603-71ba-4a83-b3c1-11bee54dff92",
    "43b53813-49c8-47b7-bed0-86f9f614ab29",
    "d35f543f-27ca-41c6-b555-0450937ac400",
    "a88b8143-b443-4935-aaaf-427465e78465",
    "a71ed29f-7647-4c79-aa8a-2899e6068022",
    "557aec44-4bd6-4af1-8107-80567228e6d5",
    "8e9b65c5-547b-40b2-a2b5-6a36e1c4cd4d",
    "0b0faadd-68c1-4c3a-a4d7-503733f8c6ee",
    "dccf8ee4-8b34-411b-ac75-6f4ce99761aa",
    "5705b9f6-26ac-45c2-8a97-f0877de259c7",
    "7de2c655-7a7b-447b-b404-fdfe40404c0b",
    "5bd429bf-0140-49da-a2f3-bcd3c0f0d818",
    "c75708b7-5f27-47ef-9796-9afd7ac00e75",
    "95da8d4b-d729-4216-bd1c-905ff939ca0e"
  ]
}
{
  "_id": "vintage",
  "id": [
    "465cf8d1-88d6-47a9-9650-7c8df5a9443f",
    "b5cc69ab-3a9c-4a35-847d-26d841e66a75",
    "0eb885e1-523b-4f1e-994b-5e17d7a65734",
    "b5b61f77-f71c-4420-9048-3301ebe963cf",
    "4d59d1e7-67b0-421d-991c-32fe105a12ec",
    "c003378c-9008-4813-a86e-7c69edb3d5dd",
    "ddf42283-6f29-4e0e-9971-67b9e56027db",
    "5c8bd68a-23be-4919-93ef-89097dad1a14",
    "093b8806-d50a-462f-b63f-82201c379fad",
    "311f1dca-1618-49f2-8c38-8a63da4fad43",
    "74c7a8f2-e812-4599-82b0-f54c2f89ea00",
    "d5b99632-415f-4335-b2cf-5835f44aa897",
    "7be612bc-d89d-4a0e-a327-75fa75f9dea0"
  ]
}

{
  "_id": "phisionet",
  "id": [
    "51df4af4-ba63-4b38-aaab-9b38f484257d"
  ]
}

{
  "_id": "hha",
  "id": [
    "I4P4YKU23ttnavbmzRy5",
    "q7zJDozjEuAlrE8HvZRe",
    "N37YqtqvBpEfNiDGNXig",
    "Atv8LlPROMzZJobI8PQq",
    "WhRNYdeVob2z5IvNHqHY"
  ]
}

{
  "_id": "digiscope",
  "id": [
    "6c592c8f-5e4d-4930-bcfa-265a7a22c834",
    "73c22f73-8b49-4480-8fb5-a2fb5d43951d",
    "92677c22-55a5-4dab-8036-1b22e3e2b23e",
    "9c3d145e-bacc-4ddb-8682-02dbcc5334a8",
    "d059e218-b520-446e-9814-a72cbba13902",
    "dd6c14fa-8e4f-420d-afb0-28a74bdca884",
    "e2a0616f-c3e5-439c-bb3c-e8bc6f9dc932",
    "60b8026e-8bc7-4eb7-b863-14d3459652f6",
    "13790f7e-018f-4ff9-bf00-a83fd146cb46",
    "16996d44-9361-4921-88de-4fc8031fd0a8",
    "1dc4ec87-bac1-4a39-883d-ef5fa4328f1c",
    "5c1f588c-0e2b-48a4-b7ef-ff8b6bf961ad",
    "71f0f841-9d9f-4a32-9b2b-b9aa159481f3",
    "f44071fb-ff90-4c25-bf4e-ebe1a3fa4ba8",
    "f0101214-94cf-4400-89e2-169ffa7436f2",
    "558971ba-2a98-43e6-b2d9-c752088532ef",
    "3e9c8242-2122-407b-afdb-e7b5999bfc80",
    "8cd52e70-cac4-46b9-8150-d63da8496f36",
    "aa12a106-b435-42ff-a2de-09bcab856cb6",
    "8367fbc2-966f-4609-9e0b-988bc398de07",
    "38ac183a-0d5d-4636-bc67-0e6036bf7bfe",
    "bf4f87bb-c098-4f2c-9301-fa95176f7221",
    "e8f34f42-6d69-4a18-89f5-81eae89a6f6f",
    "85bd701e-4334-4fce-a050-bad3363289f9",
    "61163741-28a2-41ff-bcad-0cfcc3c8530f",
    "711d5a56-7c69-40a2-a2e8-0f0c1b6c4a03",
    "e4efb200-d681-47db-b7e6-0089522902b8",
    "e696136f-6bf7-4da4-bea5-cb1d2c0fcc2b",
    "a6cacd96-0f55-4cf7-ba72-0bdfc99f22cc",
    "d9cf0c50-59cb-40e5-b6b6-fed6c3b2f138",
    "7e0a4b79-618a-45a0-8c9c-04ed145c0690",
    "b8930c30-f79e-47ad-88dd-06b4c56bab53",
    "6bc96b80-f3a8-4a5d-9ee6-6c67ad486d39",
    "c650ee79-64ae-44ca-bfc2-f7804e1730a9",
    "48511f94-d7fe-459f-8be3-ae786dcbab13",
    "8979e153-764c-4ae0-a308-dc5b9dba5034",
    "c92f8a4c-fcbd-45cf-8951-e2cb2246cd25",
    "61acbda3-235b-4aaf-970f-d8930f7f2db8",
    "7113d0d3-e176-48aa-afa8-e17b1c5d4312",
    "ad9976b8-d5ff-4299-911c-622ff7e9616b",
    "7e3ef7b2-23cd-4e9a-afe1-26243f4122e8",
    "5d56e33e-e4ab-466a-a51c-45eae991bf57",
    "f3b1fdcf-c5b8-4e80-a29a-a09768489c1c",
    "c2871001-1e10-406c-9b09-bcc11b3cb124",
    "14089ca3-7009-4131-aa49-8dfb3d0979c0",
    "defed85e-3487-4867-85ab-c3c166ca3eee",
    "1820c9a9-ad0d-445c-a558-1ee8f877d80b",
    "c7c80bed-7cfd-4a14-b67f-e8e0dc5f6716",
    "1c630b72-c3f2-4949-9f45-62d32c1709f9",
    "610196a4-6e80-41b6-b5bb-ed564d21d52b",
    "86bbc000-244b-48ef-93ca-68a8f7dd7315",
    "6af4e755-c36f-4fa0-8e1e-6d006bb979be",
    "51058a37-c077-406d-8732-8fc255d60b53",
    "7f6ad838-dec8-4060-ab5a-4b8f18a2cc1b",
    "0adc1a54-dc63-4b50-8efe-488dc75133f5",
    "b2cb22f3-4edb-4644-af49-1d5ae8df80ca",
    "0c2ec70b-4de2-4d45-9c14-1e5ded582f83",
    "703abbd9-ac2d-4e8e-8321-eb0cbcc2cb37",
    "a61b883d-022b-49bd-9d86-1f83aec32124",
    "432ca443-6192-4a23-b361-fef9c1aba55b",
    "8933c009-fb14-48b0-ab03-fefdc9ebb1b2",
    "0e087be5-6c25-4187-98f5-140863d48801",
    "66ffc93c-5714-47fb-87e4-94bef0fc34e5",
    "e3d056b2-756e-4818-925e-26f89bb77ef4",
    "5925c2ce-4269-49fa-a398-4722c3eaacd1",
    "90d26b6c-3f04-4a8a-bfac-297ab1ebc89f",
    "078c4161-9c8e-4df0-a951-368cd83a1276",
    "14b62dfa-53ed-4622-91ce-386f962215e3",
    "87137890-5ddd-4f71-93b2-b606d3a5d931",
    "4f3354dd-0fd5-42b8-8273-69ec666c8107",
    "abfd3a46-3aea-4525-a715-bafd889e1d1a",
    "a85c1d35-8aef-4852-b6e1-930668ab0cc5",
    "d412613f-8423-48ad-bccb-fe03abe1256a",
    "10a319a5-974f-46a6-ba34-376f5746f839",
    "83cb3e1b-b4e6-4749-8ed9-c998cf3453b2",
    "dcf3341c-1316-4f6a-bd0d-4c1cb3681f79",
    "ec2d5a45-71df-47b3-938d-a4310f0206d7",
    "bbb8976d-235a-474f-81d8-2c6ebde07321",
    "21ac50ef-a9fc-4ac9-9711-820567c938d4",
    "e5a49b0f-345e-40fd-89c0-902fb74b3df4",
    "1b063c7e-ef19-440f-936a-7daa2798d892",
    "8a649560-bf4c-43e8-b048-fb6fb0751292",
    "e69c2518-315a-443b-8346-4a036c9e65e9",
    "7bee221f-053f-4ee3-a3ea-f13e0984ccbb",
    "cd623fc2-f29a-4f44-b2b3-d7f71a6f683a",
    "8d2b21cf-9a0f-4c52-9d9f-bbea39c700fa"
  ]
}


{
  "_id": "h1",
  "id": [
    "sAFzB4SvClCofjt4BiJ2",
    "4jcAFyCDkhPTyDdS9hRZ",
    "j8qJFakScR66DRsH8qI9",
    "8vPAl5e0m7U1HKjYhGez",
    "6aEnhuxEBqYmujFdzBZF",
    "DGqCs7DRCHY4qwNbXeQU",
    "NHoKOMCDqNixo926Upci",
    "gKnAbGr681vsVzG2bQJi",
    "ak8sS9L9DKEwQQTXEajg",
    "1C4paeYBHD9NDKTqaRRM",
    "pGrjHXykxeqbCpwGD6FJ",
    "xIDcStpdWfck7L8otedB",
    "qHPyDwWe3GLM7yz7vOYR",
    "iUMPQJFNgjPnvarGvInz",
    "w6IZgAaW3pow6KSRmd8Y",
    "6WgTowXVJjBNnVOMc2Xj",
    "StTzYIHu0nZNWI48ieRH",
    "K7CxCWMytDOjv7wsiH09",
    "F4hySSeCsblNHAdxdLd8",
    "heOFbQYbVhbksfOEXkbY",
    "ZAG3QrxAjzk5xY0VBmKB"
  ]
}

