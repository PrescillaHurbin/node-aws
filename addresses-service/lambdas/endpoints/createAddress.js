const db = require('../common/db');
const geocoder = require('../utils/geocoder');
const apiResponse = require('../common/apiResponses');
const uuid = require('uuid');
const { createBodyValidation } = require('../validations/address.validation');

const country = { code : process.env.COUNTRY_CODE, label :  process.env.COUNTRY_LABEL};

exports.handler = async event => {
    try {
        const body = JSON.parse(event.body);

        // Validate data 
        var validation = createBodyValidation.validate(body);
        if(validation.error){
            return apiResponse._400(validation.error.details);
        }

        // Check if correct country
        const address = `${body.Street} ${body.HouseNumber}, ${body.ZipCode}`;
        const isCorrectCountry = await geocoder.checkCountryCodeFromAddress(address,country.code);
        if(!isCorrectCountry){
            return apiResponse._400({ message : `You have to enter an address in ${country.label}`});
        }
        body.id = uuid.v1();
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item : body
        };

        const data = await db.put(params).promise();
        return apiResponse._200({id : body.id});

    } catch (error) {
        console.error('error:', error)
        if(error.statusCode){
            return apiResponse._DefineResponse(error.statusCode,error);
        }
        // Default status code error
        return apiResponse._500(error);
    }
}