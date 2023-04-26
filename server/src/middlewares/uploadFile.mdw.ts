import { NextFunction } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// export const accessTokenValidate = async (req: Request, res: Response, next: NextFunction) => { 

// }

const storage = (path: string) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/' + path)
    },
    filename: (req, file, cb) => {
        const exten = file?.originalname.slice(file?.originalname.lastIndexOf('.')) || 'png'
        cb(null, uuidv4() + exten)
    },
})

const uploadImage = multer({ storage: storage('images') })

export const imageUpload = (field: string) => uploadImage.single(field)