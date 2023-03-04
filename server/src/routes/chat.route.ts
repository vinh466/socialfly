import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

const apiRouter = Router()

apiRouter.get('/', (req: Request, res: Response) => {
    res.json('Chat works!');
})

apiRouter.get('/room', (req: Request, res: Response) => {
    res.json(req.query);
})
apiRouter.get('/room/:id', (req: Request, res: Response) => {
    res.json({ id: req.params.id });
})


export default apiRouter;