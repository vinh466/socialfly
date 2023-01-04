import { Request, Response, Router } from "express";


const apiRouter = Router()

apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Api works!');
})

export default apiRouter;