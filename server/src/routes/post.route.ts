import { NextFunction, Request, Response, Router } from "express";
import postController from "@/controllers/post.controller";
import { accessTokenValidate } from "@/middlewares/jwtValidate.mdw";


const postRoute = Router()

postRoute.post('/create', accessTokenValidate, postController.create)
postRoute.get('/getNewfeed', accessTokenValidate, postController.getNewfeed)
postRoute.get('/getPosts', accessTokenValidate, postController.getPosts)
postRoute.post('/like/:id', accessTokenValidate, postController.likePost)
postRoute.post('/comment/:id', accessTokenValidate, postController.commentPosts)
postRoute.get('/comment/:id', accessTokenValidate, postController.getComment)

export default postRoute;