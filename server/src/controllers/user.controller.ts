import ApiError from "@/utils/ApiError.utils";
import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { StatusCodes } from "http-status-codes";
import { db } from "@/index";
import { isEmpty, validateObject } from "@/utils/object.util";
import { computeChatRoomId } from "@/utils/prisma.helper";

const defaultSelect = {
    username: true,
    firstname: true,
    lastname: true,
    avatar: true,
    // gender: true,
    birth: true,
    email: true,
}

const get = async (req: Request, res: Response, next: NextFunction) => {
    const { username, lastname, firstname, email, } = req.query
    const query = validateObject({ username, email, })
    if (isEmpty(query)) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, 'Query invalid'))
    }
    try {
        const user = await db.user.findMany({
            select: defaultSelect,
            where: query
        })
        return res.status(200).json({ data: user });

    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
            if (err.meta?.target == 'PRIMARY') {
                message = 'Username is exist'
                status = StatusCodes.UNPROCESSABLE_ENTITY
            }
            if (err.meta?.target == 'users_email_key') {
                message = 'Email is exist'
                status = StatusCodes.UNPROCESSABLE_ENTITY
            }
        }
        return next(new ApiError(status, message));
    }
}

const search = async (req: Request, res: Response, next: NextFunction) => {
    const query: { [key: string]: string | undefined } = validateObject(req.query)
    try {
        if (isEmpty(query)) {
            const allUser = await db.user.findMany({ select: defaultSelect, orderBy: { createdAt: 'desc' } });
            return res.status(200).json(allUser);
        }
        const user = await db.user.findMany({
            select: defaultSelect,
            where: {
                OR: [
                    { username: { contains: query.username, } },
                    { lastname: { contains: query.lastname } },
                    { firstname: { contains: query.firstname } },
                    { email: { contains: query.email } },
                ]
            }
        })
        return res.status(200).json({ data: user });

    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        if (err instanceof PrismaClientKnownRequestError && err.code == 'P2002') {
            if (err.meta?.target == 'PRIMARY') {
                message = 'Username is exist'
                status = StatusCodes.UNPROCESSABLE_ENTITY
            }
            if (err.meta?.target == 'users_email_key') {
                message = 'Email is exist'
                status = StatusCodes.UNPROCESSABLE_ENTITY
            }
        }
        return next(new ApiError(status, message));
    }
}

const getRecommend = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.username);
    try {
        const user = await db.user.findMany({
            select: defaultSelect,
            where: {
                NOT: { username: req.username, },
                followedBys: { none: { followerUser: req.username } },
                followings: { none: { followingUser: req.username } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.status(200).json({ data: user });
    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        return next(new ApiError(status, message));
    }
}
// TODO
const getFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.username);
    try {
        const user = await db.user.findMany({
            select: defaultSelect,
            where: {
                NOT: { username: req.username, },
                followings: { some: { followingUser: req.username, isRequest: true } },
            },
            orderBy: {
                createdAt: 'desc' // TODO change to sort by request friend time
            }
        })
        return res.status(200).json({ data: user });
    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        return next(new ApiError(status, message));
    }
}
// TODO
const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.username);
    try {
        const user = await db.user.findMany({
            select: {
                ...defaultSelect,
                userChatRooms: {
                    select: {
                        chatRoomId: true
                    },
                    where: {
                        chatRoom: {
                            userChatRooms: {
                                some: {
                                    username: req.username
                                }
                            }
                        }
                    }
                }
            },
            where: {
                NOT: { username: req.username, },
                followings: { some: { followingUser: req.username, isFriend: true } },
            },
            orderBy: {
                createdAt: 'desc'  // TODO change to sort by request friend time
            }
        })
        const computeUUser = user.map((value, i) => computeChatRoomId(value))

        return res.status(200).json({ data: computeUUser });
    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.INTERNAL_SERVER_ERROR
        return next(new ApiError(status, message));
    }
}

const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { recipient } = req.body
    const friendshipId = {
        followerUser_followingUser: {
            followerUser: req.username as string,
            followingUser: recipient
        }
    }
    try {
        const friendship = await db.friendship.findUnique({ where: friendshipId })

        if (friendship?.isFriend)
            return res.status(200).json({ meta: { message: 'Is already a friend' } })

        const updateUser = await db.friendship.upsert({
            where: friendshipId,
            update: {
                isRequest: true
            },
            create: {
                followerUser: req.username as string,
                followingUser: recipient,
                isRequest: true
            }
        })

        console.log(updateUser);
        return res.status(200).json({
            meta: {
                message: 'success'
            }
        })
    } catch (err) {
        let message = 'Cannot find user'
        let status = StatusCodes.NOT_FOUND
        return next(new ApiError(status, message));
    }
}

const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { isAccept, recipient } = req.body
    const friendshipId = {
        followerUser_followingUser: {
            followerUser: req.username as string,
            followingUser: recipient
        }
    }
    const friendshipId2 = {
        followerUser_followingUser: {
            followerUser: recipient,
            followingUser: req.username as string,
        }
    }
    try {
        const friendship = await db.friendship.findUnique({ where: friendshipId })

        if (friendship?.isFriend)
            return res.status(200).json({ meta: { message: 'Is already a friend' } })
        if (isAccept) {
            const updateUser = db.friendship.upsert({
                where: friendshipId,
                update: {
                    isFriend: true
                },
                create: {
                    followerUser: req.username as string,
                    followingUser: recipient,
                    isFriend: true
                }
            })
            const updateUser2 = db.friendship.upsert({
                where: friendshipId2,
                update: {
                    isFriend: true,
                    isRequest: false
                },
                create: {
                    followerUser: recipient,
                    followingUser: req.username as string,
                    isFriend: true
                }
            })
            const createChatRoom = db.chatRoom.create({
                data: {
                    memberNum: 2,
                    userChatRooms: {
                        createMany: {
                            data: [
                                { username: req.username, },
                                { username: recipient }
                            ]
                        }
                    }
                }
            })
            console.log('asdasd');
            const trnas = await db.$transaction([updateUser, updateUser2, createChatRoom])
            console.log(trnas);
        } else {
            const updateUser2 = await db.friendship.upsert({
                where: friendshipId2,
                update: {
                    isRequest: false
                },
                create: {
                    followerUser: recipient,
                    followingUser: req.username as string,
                    isRequest: false
                }
            })
        }

        return res.status(200).json({
            meta: {
                message: 'success'
            }
        })
    } catch (err) {
        console.log(err);
        let message = 'Cannot find user'
        let status = StatusCodes.NOT_FOUND
        return next(new ApiError(status, message));
    }
}

const userController = {
    get, search, getRecommend, getFriendRequest, getFriends, sendFriendRequest, acceptFriendRequest
}
export default userController