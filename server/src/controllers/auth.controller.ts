import ApiError from "@/utils/ApiError.utils";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { db } from "@/index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from 'bcryptjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/jwt.util";

interface tokenData {
    username: string;
    exp?: number;
}
export interface RegisterFormData {
    username: string
    password: string
    firstname: string
    email: string
    lastname: string
    rePassword: string
    gender: string
    dayBirth: string
    monthBirth: string
    yearBirth: string
}
const register = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email, firstname, lastname, gender, dayBirth, monthBirth, yearBirth } = req.body as Partial<RegisterFormData>
    console.log(dayBirth + '-' + monthBirth + '-' + yearBirth);
    try {
        if (!password) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Password not provided'))
        if (!username) throw (new ApiError(StatusCodes.BAD_REQUEST, 'Username not provided'))
        const birthConvert = new Date(monthBirth + '-' + dayBirth + '-' + yearBirth);
        if (birthConvert.toString() === 'Invalid Date')
            throw (new ApiError(StatusCodes.BAD_REQUEST, 'Day of birth invaild'))

        const hashPassword = await hash(password, 10)
        const user = await db.user.create({
            data: {
                username,
                password: hashPassword,
                firstname,
                lastname,
                birth: birthConvert,
                email,
                avatar: ''
            }
        })
        // Sign new refresh token
        const refreshToken = signRefreshToken(username)
        // Sign new access token
        const accessToken = signAccessToken(username)
        const { password: _, ...userRes } = user
        return res.status(200).json({
            ...userRes,
            refreshToken,
            accessToken,
        });

    } catch (err) {
        console.log(err);
        let message = 'Cannot create user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        if (err instanceof ApiError) return next(err)
        if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
            status = StatusCodes.UNPROCESSABLE_ENTITY
            if (err.meta?.target == 'PRIMARY') message = 'Username is exist'
            if (err.meta?.target == 'users_email_key') message = 'Email is exist'
        }
        return next(new ApiError(status, message));
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body
    // Check if the user exist 
    const user = await db.user.findUnique({
        where: { username }
    })
    if (!user) return next(new ApiError(404, 'User no exist !'))

    const validPassword = compare(password, user.password)
    if (!validPassword) return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Password invalid !'))

    // Sign new refresh token
    const refreshToken = signRefreshToken(username)
    // Sign new access token
    const accessToken = signAccessToken(username)
    const { password: _, ...userRes } = user
    // Send response
    res.status(StatusCodes.OK).json({
        ...userRes,
        refreshToken,
        accessToken,
    });
}

const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the refresh token from header 
        const refresh_token = req.headers['x-header-token'] as string || '';
        // Validate the Refresh token 
        const decoded = verifyRefreshToken(refresh_token)
        // Check if the user exist 
        const user = await db.user.findUnique({
            where: {
                username: decoded.username
            }
        })
        if (!user) {
            return next(new ApiError(403, 'User not exist'));
        }
        // Sign new access token
        const accessToken = signAccessToken(user.username)
        const { password: _, ...userRes } = user
        // Send response
        setTimeout(() => {
            res.status(StatusCodes.OK).json({
                ...userRes,
                accessToken,
            });
        }, 3000)
    } catch (err: any) {
        console.log(err);
        let message = 'Could not refresh access token !'
        if (err instanceof JsonWebTokenError) {
            if (err.message === 'jwt must be provided') message = 'Refresh token must be provided !'
            if (err.message === 'invalid signature') message = 'Token invalid !'
            if (['jwt expired', 'token expired'].includes(err.message)) message = 'Token expired !'
        }
        return next(new ApiError(StatusCodes.FORBIDDEN, message));
    }
};
const authController = {
    register,
    login,
    refreshAccessToken,
}
export default authController