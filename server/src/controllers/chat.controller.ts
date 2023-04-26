import ApiError from "@/utils/ApiError.utils";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { db } from "@/index";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { StatusCodes } from "http-status-codes";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/jwt.util";
import { computeRoomWithMember } from "@/utils/prisma.helper";
import { chatService } from "@/services/chat.service";

const defaultUserSelect = {
    username: true,
    firstname: true,
    lastname: true,
    avatar: true,
    // gender: true,
    birth: true,
    email: true,
}

async function getRoomList(req: Request, res: Response, next: NextFunction) {
    try {
        const chatRoomList = await chatService.getChatRoomList(req.username)
        return res.status(200).json({ data: chatRoomList });

    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
            if (err.meta?.target == 'PRIMARY') {
                message = 'Username is exist'
                status = StatusCodes.UNPROCESSABLE_ENTITY
            }
        }
        return next(new ApiError(status, message));
    }

}
async function getChatLog(req: Request, res: Response, next: NextFunction) {
    const roomId = req.params.id
    try {
        const chatLog = await chatService.getChatLog(roomId)
        return res.status(200).json({ data: chatLog });

    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
            if (err.meta?.target == 'PRIMARY') { }
        }
        return next(new ApiError(status, message));
    }
}
async function getChatRoomMember(req: Request, res: Response, next: NextFunction) {
    const roomId = req.params.id
    try {
        const members = await chatService.getChatRoomMember(roomId)
        return res.status(200).json({ data: members });

    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
            if (err.meta?.target == 'PRIMARY') { }
        }
        return next(new ApiError(status, message));
    }
}
const chatController = {
    getRoomList, getChatLog, getChatRoomMember,
}
export default chatController