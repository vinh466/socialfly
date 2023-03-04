import { NextFunction, Request, Response, Router } from "express";
import userController from "@/controllers/user.controller";
import { accessTokenValidate } from "@/middlewares/jwtValidate.mdw";


const userRoute = Router()

userRoute.get('/', accessTokenValidate, userController.get)
userRoute.get('/search', accessTokenValidate, userController.search)
userRoute.get('/getRecommend', accessTokenValidate, userController.getRecommend)
userRoute.get('/getFriendRequest', accessTokenValidate, userController.getFriendRequest)
userRoute.get('/getFriends', accessTokenValidate, userController.getFriends)

userRoute.post('/sendFriendRequest', accessTokenValidate, userController.sendFriendRequest)
userRoute.post('/acceptFriendRequest', accessTokenValidate, userController.acceptFriendRequest)


export default userRoute;