import ApiError from "@/utils/ApiError.utils";
import { verifyAccessToken } from "@/utils/jwt.util";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JsonWebTokenError } from "jsonwebtoken";

export interface TokenDecoded {
    username: string
}

export const accessTokenValidate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'] as string || '';
    console.log(token);
    try {
        const decoded = verifyAccessToken<TokenDecoded>(token)
        req.username = decoded.username;
        next();
    } catch (err) {
        // console.log(err);
        let message = 'Could not refresh access token !'
        if (err instanceof JsonWebTokenError) {
            if (err.message === 'jwt must be provided') message = 'Refresh token must be provided !'
            if (['invalid signature', 'jwt malformed'].includes(err.message)) message = 'Token invalid !'
            if (['jwt expired', 'token expired'].includes(err.message)) message = 'Token expired !'
        }
        return next(new ApiError(StatusCodes.FORBIDDEN, message));
    }
}