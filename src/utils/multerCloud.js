import multer,{diskStorage} from "multer"

export function uploadFileCloud(){

    const storage=diskStorage({})

    const multerUpload=multer({
        storage,    
    })

    return multerUpload;
}