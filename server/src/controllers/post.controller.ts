import ApiError from "@/utils/ApiError.utils";
import { NextFunction, Request, Response } from "express";
import { db } from "@/index";
import { imageUpload } from "@/middlewares/uploadFile.mdw";
import { MulterError } from "multer";

interface tokenData {
    username: string;
    exp?: number;
}
export interface FormData {
    title: string
}
const create = async (req: Request, res: Response, next: NextFunction) => {
    imageUpload('image')(req, res, async function (err) {
        if (err instanceof MulterError) {
            return res.status(422).json({ err })
        } else if (err) {
            return res.status(500).json({ err })
        }

        const { title, } = req.body as Partial<FormData>
        try {
            const post = await db.post.create({
                data: {
                    title: title || '',
                    creatorId: req.username!,
                    img: req.file?.filename ? 'http://localhost:3200/images/' + req.file?.filename : ''
                }
            })
            return res.status(200).json(post);

        } catch (err: any) {
            console.log(err);
            return next(new ApiError(500, err.message));
        }
    })
}

const getNewfeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.username);
        const post = await db.post.findMany({
            where: {
                creator: {
                    OR: [
                        { followings: { some: { followingUser: req.username, isFriend: true } }, },
                        { username: req.username, }
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                creator: {
                    select: {
                        username: true, avatar: true, firstname: true, lastname: true,
                    }
                }
            }
        })
        return res.status(200).json(post);

    } catch (err: any) {
        console.log(err);
        return next(new ApiError(500, err.message));
    }
}


const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.username);
        const post = await db.post.findMany({
            where: {
                creator: {
                    OR: [
                        { username: req.username, }
                    ]
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                creator: {
                    select: {
                        username: true, avatar: true, firstname: true, lastname: true,
                    }
                },
                postComments: {
                    select: { _count: {} }
                }
            }
        })
        return res.status(200).json(post);

    } catch (err: any) {
        console.log(err);
        return next(new ApiError(500, err.message));
    }
}
const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.username);
        console.log(req.params.id);
        const hasLike = await db.postLike.findFirst({
            where: {
                AND: {
                    username: req.username,
                    postId: req.params.id
                }
            }
        })
        if (hasLike) {
            const deleteLike = await db.postLike.delete({
                where: { id: hasLike.id }
            })
            return res.status(200).json({ like: false });
        }
        const post = await db.post.update({
            data: {
                postLikes: {
                    create: {
                        user: { connect: { username: req.username } }
                    }
                }
            },
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({ like: true });

    } catch (err: any) {
        console.log(err);
        return next(new ApiError(500, err.message));
    }
}
const commentPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        const post = await db.post.update({
            data: {
                postComments: {
                    create: {
                        user: { connect: { username: req.username } },
                        comment: req.body.comment || ''
                    }
                }
            },
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json(post);

    } catch (err: any) {
        console.log(err);
        return next(new ApiError(500, err.message));
    }
}

const getComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.username);
        const post = await db.postComment.findMany({
            where: {
                post: {
                    id: req.params.id
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        avatar: true, username: true, lastname: true, firstname: true
                    }
                }
            }
        })
        return res.status(200).json(post);

    } catch (err: any) {
        console.log(err);
        return next(new ApiError(500, err.message));
    }
}
const postController = {
    create, getNewfeed, getPosts, likePost, commentPosts, getComment
}
export default postController