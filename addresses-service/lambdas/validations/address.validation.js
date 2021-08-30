const Joi = require('@hapi/joi');

const createBodyValidation = Joi.object().keys({
    HouseNumber: Joi.string().required().max(10),
    Street : Joi.string().required().max(100),
    ZipCode: Joi.number().integer().required()
});

const updateBodyValidation = Joi.object().keys({
    HouseNumber: Joi.string().required().max(10),
    Street : Joi.string().required().max(100),
    ZipCode: Joi.number().integer().required()
});

const updateParamsValidation = Joi.object().keys({
    id: Joi.string().required(),
});


module.exports = {
    createBodyValidation,
    updateBodyValidation,
    updateParamsValidation
};
