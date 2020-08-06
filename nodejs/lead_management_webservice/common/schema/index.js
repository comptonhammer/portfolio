const Joi = require('@hapi/joi');

const leadSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
    survey_answers: Joi.array(),
    timezone: Joi.string().allow(''),
    address: Joi.object({
        street_address: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        zip: Joi.string().required()
    }),
    rating: Joi.number(),
    code: Joi.string().allow('')
});

const registerSchema = Joi.object().keys({
    name: Joi.string().trim().required(), 
    email: Joi.string().trim().email().required(),
    home_phone: Joi.string().trim().regex(/^[0-9]{7,10}$/).required(),
    cell_phone: Joi.string().trim().regex(/^[0-9]{7,10}$/).required(), 
    desired_username: Joi.string().alphanum().min(3).max(30).required(), 
    password: Joi.string().regex(/^[a-zA-Z0-9]{4,99}$/).required(), 
    password_confirm: Joi.string().regex(/^[a-zA-Z0-9]{4,99}$/).required(),
    organization: Joi.string().allow(''),
    organization_code: Joi.string().allow(''),
    address: Joi.string().allow('')
});

const cfLeadSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(''),
    address: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    zip: Joi.string().required(),
    additional_info: Joi.object().allow({})
})

module.exports = {
    leadSchema,
    registerSchema
}