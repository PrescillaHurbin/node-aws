const db = require('../common/db');
const geocoder = require('../utils/geocoder');
const apiResponse = require('../common/apiResponses');
const { updateBodyValidation, updateParamsValidation } = require('../validations/address.validation');

const country = { code : process.env.COUNTRY_CODE, label :  process.env.COUNTRY_LABEL};

exports.handler = async event => {
    try {

         // Validate params 
         var validation = updateParamsValidation.validate(event.pathParameters);
         if(validation.error){
            return apiResponse._400(validation.error.details);
         }

        // Check if address exist in db
        const paramsExist = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: { id: event.pathParameters.id },
        }
        const dataExist = await db.get(paramsExist).promise();
        if(JSON.stringify(dataExist) === '{}'){
            return apiResponse._404({ message : `There was an error fetching the data for id of ${event.pathParameters.id} from ${process.env.DYNAMODB_TABLE_NAME}`});
        }

        const body = JSON.parse(event.body);

        // Validate data 
        var validation = updateBodyValidation.validate(body);
        if(validation.error){
            return apiResponse._400(validation.error.details);
        }

        // Check if correct country
        const address = `${body.Street} ${body.HouseNumber}, ${body.ZipCode}`;
        const isCorrectCountry = await geocoder.checkCountryCodeFromAddress(address,country.code);
        if(!isCorrectCountry){
            return apiResponse._400({message : `You have to enter an address in ${country.label}`});
        }

        // Remove id if exist in body
        if(body.id){
           delete body.id ;
        }
        const objKeys = Object.keys(body);

        // Map key and value for update
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: { id: event.pathParameters.id },
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {}),
            ReturnValues: "UPDATED_NEW"
        };

        const data = await db.update(params).promise();
        return apiResponse._200({ id: event.pathParameters.id });

    } catch (error) {
        console.error('error:', error)
        if(error.statusCode){
            return apiResponse._DefineResponse(error.statusCode,error);
        }
        // Default status code error
        return apiResponse._500(error);
    }
}