import { BsBoxArrowUp, BsChatSquareText, BsHandThumbsUp, BsReply, BsThreeDots } from "react-icons/bs"
import Button from "./Button"
import { getMessageTime } from "@/utils/time.util"
import axios, { AxiosError } from "axios"
import { RootState } from "@/store"
import { useSelector } from "react-redux"
import { authAction } from "@/store/auth.slice"
import { useEffect, useState } from "react"
export interface PostField {
    createdAt: string
    creatorId: string
    id: string
    img: string
    published: boolean
    title: string
    creator: {
        username: string
        avatar: string
        firstname: string
        lastname: string
    }
}interface Comment {
    comment: string
    createdAt: string
    id: string
    postId: string
    userId: string
    user: {
        avatar: string
        username: string
        lastname: string
        firstname: string
    }
}
interface Props {
    post: PostField
}
function Post({ post }: Props) {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    const [comment, setComment] = useState('')
    const [commentList, setCommentList] = useState<Array<Comment>>([])
    const handleLikePost = async () => {
        console.log(post.id);
        console.log(userInfo?.accessToken);
        try {
            const result = await axios.post('http://localhost:3200/api/post/like/' + post?.id, {}, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': userInfo?.accessToken
                }
            })
            console.log(result);
            if (result.status === 200) {
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    }
    const handleComment = async () => {
        console.log(comment);
        if (!comment) return;
        try {
            const result = await axios.post('http://localhost:3200/api/post/comment/' + post?.id, { comment: comment }, {
                headers: {
                    'authorization': userInfo?.accessToken
                }
            })
            console.log(result);
            if (result.status === 200) {
                setComment('')
                getComment()
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    }
    const getComment = async (signal?: AbortSignal) => {
        try {
            const result = await axios.get<Array<Comment>>('http://localhost:3200/api/post/comment/' + post?.id, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': userInfo?.accessToken
                },
                signal
            })
            console.log(result);
            if (result.status === 200) {
                result.data && setCommentList([...result.data])
            }
        } catch (err: any) {
            if (err instanceof AxiosError && err.code !== "ERR_CANCELED") {
                console.log(err)
            }
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        getComment(controller.signal)
        return () => controller.abort()
    }, [])

    return <div className=" background p-3 my-2 w-full">
        <div className="flex-1 min-w-[320px] flex items-center" >
            <img src={post?.creator.avatar ? post?.creator.avatar : '/public/no-avatar.png'} alt="no avatar" className="rounded-full w-10 h-10 object-cover mr-4" />
            <div className="flex flex-col flex-1 ">
                <div className="flex justify-between">
                    <div>
                        <span className="block font-semibold text-sm">{post?.creator.firstname + ' ' + post?.creator.lastname}</span>
                        <span className="block italic text-xs">@{post?.creatorId}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="block italic text-xs mr-3 text-gray-600 dark:text-gray-400">{post?.createdAt && getMessageTime(post.createdAt)}</span>
                        <Button className="px-2 "><BsThreeDots /></Button>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-1 my-1">
            {post?.title}
        </div>
        {post?.img && <div className="my-2">
            <img src={post.img} alt="anh" className="w-full max-h-[600px] object-cover rounded-md" />
        </div>}
        <div className="border-t border-gray-400" ></div>
        <div className="mt-4">

            <div className="flex justify-between">
                <Button className="text-sm p-2 flex items-center gap-1">
                    <BsChatSquareText /><span> Bình luận</span>
                </Button>
                <div className="flex">
                    <Button className="text-sm p-2 flex items-center gap-1" onClick={() => handleLikePost()}>
                        <BsHandThumbsUp /><span> Thích</span>
                    </Button>
                </div>
            </div>

            <div>{commentList.map((comment, i) => (
                <div key={i}>
                    <div className="flex mt-3 mb-1">
                        <img src={comment?.user?.avatar || '/public/no-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full p-1" />
                        <div className=" ml-2">
                            <div className="flex flex-col rounded px-3 bg-slate-200 dark:bg-gray-600">
                                <span className="font-bold">{comment.userId}</span>
                                <span>{comment.comment}</span>
                            </div>
                        </div>
                    </div>
                    <div className="ml-12 flex items-center">
                        <span className="text-xs ml-3">{comment?.createdAt && getMessageTime(comment.createdAt)}</span>
                    </div>

                </div>
            ))
            }
            </div>

            <div className="flex">
                <input
                    type="search"
                    className="flex-1 m-2 mt-5 bg-slate-200 p-2 rounded-lg hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600"
                    placeholder="Bình luận ..."
                    value={comment}
                    onChange={(e) => { setComment(e.target.value) }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleComment() }}
                />
                <Button
                    className="font-medium rounded-lg text-sm px-4 m-2  mt-5 border-slate-800"
                    background
                    onClick={() => handleComment()}
                >
                    Gửi
                </Button>
            </div>
        </div>
    </div>
}

export default Post