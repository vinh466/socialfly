import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import chatRoute from './chat.route';
import authRoute from './auth.route';
import userRoute from "./user.route";
import postRoute from "./post.route";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const apiRouter = Router()

apiRouter.get('/', (req: Request, res: Response) => {
    res.json('Api works!');
})
apiRouter.use('/chat', chatRoute)
apiRouter.use('/auth', authRoute)
apiRouter.use('/user', userRoute)
apiRouter.use('/post', postRoute)

export default apiRouter;