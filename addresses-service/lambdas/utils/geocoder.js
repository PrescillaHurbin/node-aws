const ApiError = require('../common/apiError');
const _ = require('underscore');
const axios = require('axios').default;
const geocoderURL = 'https://maps.googleapis.com/maps/api/geocode/json';
const apiKey = process.env.GOOGLE_GEOCODE_API_KEY;

function buildURL (params){
    return `${geocoderURL}${params}&key=${apiKey}`;
}

module.exports = {
    async checkCountryCodeFromAddress(address,countryCode){
        try{
            const params = `?address=${address}`
            const uri = buildURL(params);
            const response = await axios.get(encodeURI(uri));
            const data = response.data;

            if(data.status === "REQUEST_DENIED"){
                throw new ApiError(500,`Something wrong happen with geocoder ::: ${data.error_message}`);
            }
            if(data.status === "ZERO_RESULTS"){
                throw new ApiError(400,`Something wrong happen with geocoder ::: Unknown address`);
            }
            if(data.status != "OK"){
                throw new ApiError(500,`Something wrong happen with geocoder ::: ${data.error_message}`);
            }
 
            // Extract country
            const country = _.find(data.results[0].address_components, function(component) {
                return _.contains(component.types, 'country')
            });

            if(!country){
                throw new ApiError(500,`Something wrong happen with geocoder ::: Country not found`);
            }

            if (country.short_name != countryCode) {
                return false;
            }

            return true;

        }catch(error){
            if(error.statusCode){
                throw new ApiError(error.statusCode, error.message);
            }
            throw new ApiError(500,`Something wrong happen with geocoder ::: ${error}`);
        }
    }
}