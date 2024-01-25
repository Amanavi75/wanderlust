const Joi = require('joi');
// basically when we write the custom schema in the app fle it looks so clumsy 

// that why we use the joi package for the server side validation

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null)
    }).required()
})