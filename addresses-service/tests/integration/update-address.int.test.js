const eventGenerator = require('../utils/eventGenerator');

const updateAddress = require('../../lambdas/endpoints/updateAddress');

const correctData = { "HouseNumber" : "130", "Street" : "Rue de Taillis Pré", "ZipCode" : 6200 };
const badData = { "HouseNumber" : "29", "Street" : "Champs-Élysées", "ZipCode" : 75008 };
const missingData = { "Street" : "Rue de Taillis Pré", "ZipCode" : 6200 };


describe('Update address integration tests', ()=>{

    test('Should return a 200 with the id if address is valid', async ()=>{
        const event = eventGenerator({
            body : correctData,
            pathParametersObject: {
                id: '1234',
            },
        });

        const res = await updateAddress.handler(event);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body).toHaveProperty('id');
    });

    test('Should return 400 if not pass an id in params', async () => {
        const event = eventGenerator({body : correctData});
        const res = await updateAddress.handler(event);
        expect(res.statusCode).toBe(400);
    });

    test('Should return a 404 if address not exist', async ()=>{
        const event = eventGenerator({
            body : correctData,
            pathParametersObject: {
                id: '12345',
            },
        });
        const res = await updateAddress.handler(event);
        expect(res.statusCode).toBe(404);
    })

    test('Should return a 400 if the address is not valid', async ()=>{
        const event = eventGenerator({
            body : badData,
            pathParametersObject: {
                id: '1234',
            },
        });
        const res = await updateAddress.handler(event);
        expect(res.statusCode).toBe(400);
    })

    test('Should return a 400 if missing data in body', async ()=>{
        const event = eventGenerator({
            body : missingData
        });

        const res = await updateAddress.handler(event);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(400);
    })

    test('Should return a 400 if HouseNumber value is not valid', async ()=>{
        correctData.HouseNumber = "1111111111111";
        const event = eventGenerator({
            body : correctData,
            pathParametersObject: {
                id: '1234',
            },
        });
        const res = await updateAddress.handler(event);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(400);
    })

    test('Should return a 400 if Street value is not valid', async ()=>{
        correctData.Street = "Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test";
        const event = eventGenerator({
            body : correctData,
            pathParametersObject: {
                id: '1234',
            },
        });
        const res = await updateAddress.handler(event);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(400);
    })

    test('Should return a 400 if ZipCode value is not valid', async ()=>{
        correctData.ZipCode = "6200";
        const event = eventGenerator({
            body : correctData,
            pathParametersObject: {
                id: '1234',
            },
        });
        const res = await updateAddress.handler(event);

        expect(res).toBeDefined();
        expect(res.statusCode).toBe(400);
    })
})