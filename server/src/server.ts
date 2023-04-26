import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { NodeEnvs } from '@/declarations/enum';
import { RouteError } from '@/declarations/classes';
import EnvVars from '@/declarations/config/envVars';
import BaseRouter from '@/routes/api.route';
import ApiError from './utils/ApiError.utils';
import uploadRouter from './routes/upload.route';

const server = express();


// **** Set basic express settings **** //

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser(EnvVars.cookieProps.secret));

if (EnvVars.nodeEnv === NodeEnvs.Dev) {
    server.use(morgan('dev'));
}

// if (EnvVars.nodeEnv === NodeEnvs.Production) {
//     server.use(cors());
// }
server.use(express.static('public'));
server.use(cors());


// **** Add API routes **** //

server.get('/', (req: Request, res: Response) => {
    res.send('Server works!');
});

server.use('/upload', uploadRouter);
server.use('/api', BaseRouter);

// handle 404 response
server.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"))
})
// handle api error
server.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    // logger.err(err, true);
    let status = StatusCodes.BAD_REQUEST;

    if (err instanceof ApiError) {
        status = err.statusCode
        return res.status(status).json({ message: err.message });
    } else if (err instanceof RouteError) {
        status = err.status;
        return res.status(status).json({ message: err.message });
    }
});

export default server;