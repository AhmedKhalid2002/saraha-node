import Joi from "joi"
export const signUpSchima=Joi.object({
    userName:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Za-z0-9]{5,10}/).required(),
    age:Joi.number().min(18).max(80).message({
        "number.max":"age must be less than 80",
        "number.min":"age must be greater than 17"
    }),
    gender:Joi.string().valid('male','female').required(),
    phone:Joi.string().pattern(/^(01|01|00201)[0-2,5]{1}[0-9]{8}/).required()
}).required()

export const loginSchima=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(/^[A-Za-z0-9]{5,10}/).required(),
}).required()

export const activationSchema=Joi.object({
    token:Joi.string().required()
}).required()

export const forgetCodeSchema=Joi.object({
    email:Joi.string().email().required(),
}).required()

export const resetPasswordSchema=Joi.object({
    email:Joi.string().email().required(),
    code:Joi.string().length(5).required(),
    password:Joi.string().pattern(/^[A-Za-z0-9]{5,10}/).required(),
}).required()
