import chatController from "@/controllers/chat.controller";
import { accessTokenValidate } from "@/middlewares/jwtValidate.mdw";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const apiRouter = Router()

apiRouter.get('/', (req: Request, res: Response) => {
    res.json('Chat works!');
})

apiRouter.get('/room', accessTokenValidate, chatController.getRoomList)
apiRouter.get('/room/:id/chatLog', accessTokenValidate, chatController.getChatLog)
apiRouter.get('/room/:id/member', chatController.getChatRoomMember)


export default apiRouter;