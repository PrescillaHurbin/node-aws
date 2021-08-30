const db = require('../../lambdas/common/db');
const validTableName = 'addresses-dev';

test('Should correctly create an address', async () => {
    const data = {
        "id" : "1234",
        "HouseNumber" : "29",
        "Street" : "Champs-Élysées",
        "ZipCode" : 75008
    };
    const params = {
        TableName: validTableName,
        Item : data
    };
    await expect(db.put(params).promise()).toStrictEqual(Promise.resolve({}));
});

test('Should correctly update an address', async () => {
    const data = {
        HouseNumber : "29",
        Street : "Champs-Élysées",
        ZipCode : 75008
    };
    const objKeys = Object.keys(data);

    const id = "1234";
    const params = {
        TableName: validTableName,
        Key: { id: id },
        UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
        ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`#key${index}`]: key,
        }), {}),
        ExpressionAttributeValues: objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`:value${index}`]: data[key],
        }), {}),
        ReturnValues: "UPDATED_NEW"
    };

    const res = await db.update(params).promise();
    expect(res.Attributes).toStrictEqual(data);
});
