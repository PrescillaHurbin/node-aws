var S3 = require('../common/S3');

exports.handler = (event, context, callback) => {
    event.Records.forEach((record) => {
        console.log('record.eventName:', record.eventName)
        if (record.eventName == 'INSERT' || record.eventName == 'MODIFY') {
            const fileName = record.eventName 
            + "_ADDRESS_ID_" + record.dynamodb.NewImage.id.S 
            + "_EVENT_ID_" + record.eventID 
            + ".json";
            S3.write(record,fileName);
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
};
