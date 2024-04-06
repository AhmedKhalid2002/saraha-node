import { Types } from "mongoose"

export const validation=(schema)=>{
    return(req,res,next)=>{
        const data={...req.body,...req.params,...req.query}
        const validationResult=schema.validate(data,{
            abortEarly:false
        })
        if(validationResult.error){
            const validationMessage=validationResult.error.details.map((obj)=>obj.message);
            return next(new Error(validationMessage))
        }
        return next();
    } 
}


export const validationObjectId=(value,helper)=>{
    if(Types.ObjectId.isValid(value))return true

    return helper.message("invalid object id")
}