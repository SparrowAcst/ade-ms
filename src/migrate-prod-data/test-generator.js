const { AmqpManager, Middlewares } = require('@molfar/amqp-client');

const log = require("../utils//logger")(__filename)


const config = require("../../.config/ade-import")
const configRB = config.rabbitmq.TEST
const normalize = configRB.normalize

const DATA_CONSUMER = normalize({
    queue: {
        name: "migate_prod_1",
        exchange: {
            name: 'migate_prod_1_exchange',
            options: {
                durable: true,
                persistent: true
            }
        },
        options: {
            noAck: false,
            exclusive: false
        }
    }
})

const PUBLISHER = normalize({
    exchange: {
        name: 'migate_prod_1_exchange',
        options: {
            durable: true,
            persistent: true
        }
    }
})

const testData = [
    // {
    //     "id": "d0ba556d-3d21-4e1c-a3c4-8cf982e39b95",
    //     "source": "prod_ua",
    //     "notes": "Check for innocent murmurs",
    //     "userId": "50d59a23-c816-4445-aadc-38cb6b63e2d2",
    //     "spot": "pulmonary",
    //     "bodyPosition": "sitting",
    //     "latitude": 49.95075513510236,
    //     "longitude": 36.04504394577519,
    //     "userAgent": "90F5A9F4-E98C-49CD-8663-4CC06F839C99 iPhone15,3 17.5.1 3.1.1(7898)",
    //     "examinationId": "943d8b71-9805-43d4-9cb7-dacce8e1db1f",
    //     "examinationTitle": "V2-ADD-IP16E-RT-MTM",
    //     "examinationAge": null,
    //     "examinationWeight": null,
    //     "recordExaminationId": "943d8b71-9805-43d4-9cb7-dacce8e1db1f",
    //     "userRole": null
    // },
    {
        "id": "d10ffffd-f1db-4ab5-a878-006125af25b8",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "c5547d99-9482-4cc9-8c37-b1a318e967a0",
        "spot": "leftCarotid",
        "bodyPosition": "sitting",
        "latitude": 0.0,
        "longitude": 0.0,
        "userAgent": "4ABACB75-CCC3-4FE7-B560-DDAD0BFB397A iPhone15,2 17.5.1 3.1.1(7898)",
        "examinationId": "943d8b71-9805-43d4-9cb7-dacce8e1db1f",
        "examinationTitle": "V2-ADD-IP16E-RT",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "67796544-f187-4a9a-870f-7405e0432129",
        "userRole": null
    },
    {
        "id": "d230791d-25bd-46d4-bb0a-c82247303144",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "23884821-eb44-47ea-bffa-e79bb6090298",
        "spot": "pulmonary",
        "bodyPosition": "supine",
        "latitude": 50.63374000742851,
        "longitude": 26.20058750878946,
        "userAgent": "467884E5-77FC-400C-8F6D-29F9AE5E0B6F iPhone 12 Mini 17.5.1 3.3.0(8956)",
        "examinationId": "14c960e0-a297-4616-b985-52aa212c2673",
        "examinationTitle": "V2-ADD-IP16E-RT-OTO",
        "examinationAge": 18,
        "examinationWeight": 59000,
        "recordExaminationId": "14c960e0-a297-4616-b985-52aa212c2673",
        "userRole": null
    },
    {
        "id": "d4eea98f-4b24-4a58-97b4-b031101bd646",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "424fc753-f39f-48ad-aa11-7516fdb8de8f",
        "spot": "upperBackRightLung",
        "bodyPosition": "standing",
        "latitude": 50.409534326726096,
        "longitude": 30.619702210588773,
        "userAgent": "CF90A01B-556F-4F83-84BD-5F1B2467FD72 iPhone 12 17.2.1 2.2.0(5556)",
        "examinationId": "fec51db1-2260-4862-beaa-eaf1b1e141b5",
        "examinationTitle": "V3-ADD-IP16E-RT-MTM",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "fec51db1-2260-4862-beaa-eaf1b1e141b5",
        "userRole": null
    },
    {
        "id": "d7323ace-be40-4206-a446-9d952091f628",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "8eb0dab9-f758-41ee-b787-8bd7588df108",
        "spot": "pulmonary",
        "bodyPosition": "standing",
        "latitude": 50.532143842654285,
        "longitude": 30.248250492905974,
        "userAgent": "209AF68A-EB8A-469E-B4A0-32B3107F078C iPhone15,3 17.2.1 2.2.0(5556)",
        "examinationId": "c158677f-d6c2-41ec-9fe1-e0b3009eae9b",
        "examinationTitle": "V3-ADD-IP16E-RT-OTO",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "c158677f-d6c2-41ec-9fe1-e0b3009eae9b",
        "userRole": null
    },
    {
        "id": "d8f1cf16-2fbc-4665-8168-b353c4b48668",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "940b71ed-80c0-43fa-b902-5afffedc39b7",
        "spot": "rightCarotid",
        "bodyPosition": "sitting",
        "latitude": 49.8563050710959,
        "longitude": 24.060175722500446,
        "userAgent": "7EC3DB1E-8227-4B9E-B818-BCC2D2D3062B iPhone 13 18.0 3.3.0(8956)",
        "examinationId": "5ea76994-5634-4413-8203-698f44ee09cf",
        "examinationTitle": "V3-ADD-IP16E-RT-LTR",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "5ea76994-5634-4413-8203-698f44ee09cf",
        "userRole": null
    },
    {
        "id": "db50e013-309c-4a46-92bb-1134f777dae8",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "532a65e1-264d-4a8d-9fc0-203c54da3b46",
        "spot": "pulmonary",
        "bodyPosition": "supine",
        "latitude": 49.403300641567334,
        "longitude": 32.0451813871701,
        "userAgent": "894247E7-147F-4DD8-92DB-74AFC8C0A785 iPhone14,7 17.5.1 3.1.1(7898)",
        "examinationId": "be1b1294-98dd-4b62-8dbd-9e9211bc9d73",
        "examinationTitle": "V2-ADD-IP16E-PT-WN",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "be1b1294-98dd-4b62-8dbd-9e9211bc9d73",
        "userRole": null
    },
    {
        "id": "dbe0e48d-a7fc-452d-8bc5-a24487f0d44b",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "f085b1c9-0a73-4b64-8bda-f17b690c32ff",
        "spot": "tricuspid",
        "bodyPosition": "sitting",
        "latitude": 48.90632255838007,
        "longitude": 24.70955236328981,
        "userAgent": "0DEF4DE3-9992-4E72-BB3C-1FFEDE399AAF iPhone15,5 17.6.1 3.3.0(8956)",
        "examinationId": "7b0f1b41-b9cf-4836-81b2-2310b8b8671b",
        "examinationTitle": "V3-ADD-IP16E-PT-WN",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "7b0f1b41-b9cf-4836-81b2-2310b8b8671b",
        "userRole": null
    },

    /////////////////////////////////////////

        {
        "id": "d4eea98f-4b24-4a58-97b4-b031101bd646",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "424fc753-f39f-48ad-aa11-7516fdb8de8f",
        "spot": "upperBackRightLung",
        "bodyPosition": "standing",
        "latitude": 50.409534326726096,
        "longitude": 30.619702210588773,
        "userAgent": "CF90A01B-556F-4F83-84BD-5F1B2467FD72 iPhone 12 17.2.1 2.2.0(5556)",
        "examinationId": "fec51db1-2260-4862-beaa-eaf1b1e141b5",
        "examinationTitle": "V2-ADD-IP16E-PT-CSHP",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "fec51db1-2260-4862-beaa-eaf1b1e141b5",
        "userRole": null
    },
    {
        "id": "d7323ace-be40-4206-a446-9d952091f628",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "8eb0dab9-f758-41ee-b787-8bd7588df108",
        "spot": "pulmonary",
        "bodyPosition": "standing",
        "latitude": 50.532143842654285,
        "longitude": 30.248250492905974,
        "userAgent": "209AF68A-EB8A-469E-B4A0-32B3107F078C iPhone15,3 17.2.1 2.2.0(5556)",
        "examinationId": "c158677f-d6c2-41ec-9fe1-e0b3009eae9b",
        "examinationTitle": "V3-ADD-IP16E-PT-CSHP",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "c158677f-d6c2-41ec-9fe1-e0b3009eae9b",
        "userRole": null
    },
    {
        "id": "db50e013-309c-4a46-92bb-1134f777dae8",
        "source": "prod_ua",
        "notes": "Check for innocent murmurs",
        "userId": "532a65e1-264d-4a8d-9fc0-203c54da3b46",
        "spot": "pulmonary",
        "bodyPosition": "supine",
        "latitude": 49.403300641567334,
        "longitude": 32.0451813871701,
        "userAgent": "894247E7-147F-4DD8-92DB-74AFC8C0A785 iPhone14,7 17.5.1 3.1.1(7898)",
        "examinationId": "be1b1294-98dd-4b62-8dbd-9e9211bc9d73",
        "examinationTitle": "V2-ADD-IP16E-CS10P",
        "examinationAge": null,
        "examinationWeight": null,
        "recordExaminationId": "be1b1294-98dd-4b62-8dbd-9e9211bc9d73",
        "userRole": null
    },
    // {
    //     "id": "dbe0e48d-a7fc-452d-8bc5-a24487f0d44b",
    //     "source": "prod_ua",
    //     "notes": "Check for innocent murmurs",
    //     "userId": "f085b1c9-0a73-4b64-8bda-f17b690c32ff",
    //     "spot": "tricuspid",
    //     "bodyPosition": "sitting",
    //     "latitude": 48.90632255838007,
    //     "longitude": 24.70955236328981,
    //     "userAgent": "0DEF4DE3-9992-4E72-BB3C-1FFEDE399AAF iPhone15,5 17.6.1 3.3.0(8956)",
    //     "examinationId": "7b0f1b41-b9cf-4836-81b2-2310b8b8671b",
    //     "examinationTitle": "V3-ADD-IP16E-CS10P",
    //     "examinationAge": null,
    //     "examinationWeight": null,
    //     "recordExaminationId": "7b0f1b41-b9cf-4836-81b2-2310b8b8671b",
    //     "userRole": null
    // },

    // {
    //     "id": "d8f1cf16-2fbc-4665-8168-b353c4b48668",
    //     "source": "prod_ua",
    //     "notes": "Check for innocent murmurs",
    //     "userId": "940b71ed-80c0-43fa-b902-5afffedc39b7",
    //     "spot": "rightCarotid",
    //     "bodyPosition": "sitting",
    //     "latitude": 49.8563050710959,
    //     "longitude": 24.060175722500446,
    //     "userAgent": "7EC3DB1E-8227-4B9E-B818-BCC2D2D3062B iPhone 13 18.0 3.3.0(8956)",
    //     "examinationId": "5ea76994-5634-4413-8203-698f44ee09cf",
    //     "examinationTitle": "V2-ADD-IP16E-NE",
    //     "examinationAge": null,
    //     "examinationWeight": null,
    //     "recordExaminationId": "5ea76994-5634-4413-8203-698f44ee09cf",
    //     "userRole": null
    // },

    // {
    //     "id": "dbe0e48d-a7fc-452d-8bc5-a24487f0d44b",
    //     "source": "prod_ua",
    //     "notes": "Check for innocent murmurs",
    //     "userId": "f085b1c9-0a73-4b64-8bda-f17b690c32ff",
    //     "spot": "tricuspid",
    //     "bodyPosition": "sitting",
    //     "latitude": 48.90632255838007,
    //     "longitude": 24.70955236328981,
    //     "userAgent": "0DEF4DE3-9992-4E72-BB3C-1FFEDE399AAF iPhone15,5 17.6.1 3.3.0(8956)",
    //     "examinationId": "7b0f1b41-b9cf-4836-81b2-2310b8b8671b",
    //     "examinationTitle": "V3-ADD-IP16E-NE",
    //     "examinationAge": null,
    //     "examinationWeight": null,
    //     "recordExaminationId": "7b0f1b41-b9cf-4836-81b2-2310b8b8671b",
    //     "userRole": null
    // },

    // {
    //     "id": "d8f1cf16-2fbc-4665-8168-b353c4b48668",
    //     "source": "prod_ua",
    //     "notes": "Check for innocent murmurs",
    //     "userId": "940b71ed-80c0-43fa-b902-5afffedc39b7",
    //     "spot": "rightCarotid",
    //     "bodyPosition": "sitting",
    //     "latitude": 49.8563050710959,
    //     "longitude": 24.060175722500446,
    //     "userAgent": "7EC3DB1E-8227-4B9E-B818-BCC2D2D3062B iPhone 13 18.0 3.3.0(8956)",
    //     "examinationId": "5ea76994-5634-4413-8203-698f44ee09cf",
    //     "examinationTitle": "V2-ADD-IP16E-PT-SR5U",
    //     "examinationAge": null,
    //     "examinationWeight": null,
    //     "recordExaminationId": "5ea76994-5634-4413-8203-698f44ee09cf",
    //     "userRole": null
    // },

    // {
    //     "id": "d8f1cf16-2fbc-4665-8168-b353c4b48668",
    //     "source": "prod_ua",
    //     "notes": "Check for innocent murmurs",
    //     "userId": "940b71ed-80c0-43fa-b902-5afffedc39b7",
    //     "spot": "rightCarotid",
    //     "bodyPosition": "sitting",
    //     "latitude": 49.8563050710959,
    //     "longitude": 24.060175722500446,
    //     "userAgent": "7EC3DB1E-8227-4B9E-B818-BCC2D2D3062B iPhone 13 18.0 3.3.0(8956)",
    //     "examinationId": "5ea76994-5634-4413-8203-698f44ee09cf",
    //     "examinationTitle": "V3-ADD-IP16E-PT-SR5U",
    //     "examinationAge": null,
    //     "examinationWeight": null,
    //     "recordExaminationId": "5ea76994-5634-4413-8203-698f44ee09cf",
    //     "userRole": null
    // },
    


]


const run = async () => {

    log(`TEST GENERATOR FOR MIGRATE PROD DATA`)
    console.log(PUBLISHER)

    const consumer = await AmqpManager.createConsumer(DATA_CONSUMER)

    let assertion = await consumer.getStatus()
    log.table([assertion])


    const publisher = await AmqpManager.createPublisher(PUBLISHER)
    publisher.use(Middlewares.Json.stringify)

    await publisher.send(testData[0])

    // for (let d of testData) {
    //     console.log("send", d)
    //     await publisher.send(d)
    //     console.log("done")
    // }

    assertion = await consumer.getStatus()
    log.table([assertion])

    await publisher.close()
    await consumer.close()
}

run()