import { NextFunction, Request, Response, Router } from "express";
import authController from "@/controllers/auth.controller";
import { accessTokenValidate } from "@/middlewares/jwtValidate.mdw";


const authRoute = Router()

authRoute.post('/updateAvatar', accessTokenValidate, authController.updateAvatar)
authRoute.post('/register', authController.register)
authRoute.post('/login', authController.login)
authRoute.post('/refreshToken', authController.refreshAccessToken)


export default authRoute;