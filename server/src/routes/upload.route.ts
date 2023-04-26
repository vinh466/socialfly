import { accessTokenValidate } from "@/middlewares/jwtValidate.mdw";
import { imageUpload } from "@/middlewares/uploadFile.mdw";
import { Router } from "express";
import { MulterError } from "multer";

const uploadRouter = Router()

uploadRouter.post('/image', function (req, res) {
    imageUpload('image')(req, res, function (err) {
        if (err instanceof MulterError) {
            return res.status(422).json({ err })
        } else if (err) {
            return res.status(500).json({ err })
        }
        console.log(req.body);
        return res.status(200).json({
            body: req.body,
            file: req.file
        })
    })
})

export default uploadRouter;