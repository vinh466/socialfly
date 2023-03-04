import { NextFunction, Request, Response, Router } from "express";
import authController from "@/controllers/auth.controller";


const authRoute = Router()

authRoute.post('/register', authController.register)
authRoute.post('/login', authController.login)
authRoute.post('/refreshToken', authController.refreshAccessToken)


export default authRoute;