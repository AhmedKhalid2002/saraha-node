import Joi from "joi"
import { validationObjectId } from "../../middlewares/validation.middleware.js"


export const messageSchema=Joi.object({
    content:Joi.string().required(),
    userReciverId:Joi.custom(validationObjectId)
})