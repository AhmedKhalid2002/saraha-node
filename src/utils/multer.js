import multer,{diskStorage} from "multer"
import {nanoid} from 'nanoid'

export const fileValidation={
    images:["image/jpeg","image/png"],
}
export function fileUpload({folder,filter}){

    const storage=diskStorage({
        destination:`uploads/${folder}`,
        filename:(req,file,callBack)=>{
            callBack(null,nanoid()+"__"+file.originalname)
        }
    })

    const fileFilter=(req,file,callBack)=>{
         if(!filter.includes(file.mimetype)){
            return callBack(new Error("invalid format, file must be jpeg or png  "),false)
         }
         return callBack(null,true)
    }
    
    const multerUpload=multer({
        storage,
        fileFilter,
    })

    return multerUpload;
}