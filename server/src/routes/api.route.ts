import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import chatRouter from './chat.route';
import authRoute from './auth.route';
import userRoute from "./user.route";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const apiRouter = Router()

apiRouter.get('/', (req: Request, res: Response) => {
    res.json('Api works!');
})
apiRouter.use('/chat', chatRouter)
apiRouter.use('/auth', authRoute)
apiRouter.use('/user', userRoute)
apiRouter.get('/getTag', async (req: Request, res: Response) => {
    const result = await prisma.tag.findMany({
        include: {
            HasChild: true
        },
        where: {
            parentId: null
        }
    })

    res.json(result);
})

export default apiRouter;