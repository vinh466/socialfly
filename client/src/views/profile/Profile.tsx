import Button from "@/components/Button";
import Post, { PostField } from "@/components/Post";
import { RootState } from "@/store";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { BsBoxArrowUp, BsChatSquareText, BsFillChatSquareTextFill, BsHandThumbsUp, BsHeart, BsReply, BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UpdateAvatar from "./UpdateAvatar";
import FriendList from "../friend/components/FriendList";

export default function Profile() {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    const [post, setPost] = useState<Array<PostField>>([])
    async function getPost(signal?: AbortSignal) {
        try {
            const result = await axios.get<Array<PostField>>('http://localhost:3200/api/post/getPosts', {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': userInfo?.accessToken
                },
                signal
            })
            console.log(result);
            if (result.status === 200) {
                setPost(result.data)
            }
        } catch (err: any) {
            if (err instanceof AxiosError && err.code !== "ERR_CANCELED") {
                console.log(err)
            }
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        getPost(controller.signal)
        return () => controller.abort()
    }, [])
    return (
        <div>
            <div className="background mb-2 overflow-hidden">
                <div>
                    <div className="flex flex-row flex-wrap gap-4 max-h-[460px] custom-scrollbar overflow-y-auto">
                        {/* <img src="/public/bg-profile.png" alt="profile bg" className="h-[200px] w-full object-cover" /> */}
                        <div className="flex-1 flex items-center p-4">
                            <UpdateAvatar avatar={userInfo?.avatar} onUpdate={() => { getPost() }} />
                            <div className="flex flex-col flex-1 mx-4">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="block text-xl font-bold">{userInfo?.firstname + ' ' + userInfo?.lastname}</span>
                                        <span className="block italic text-lg">@{userInfo?.username}</span>
                                    </div>
                                </div>
                                <div className="self-end mt-2">
                                    {/* <Button border className="ml-2 py-1 px-2  text-sm text-sky-400 dark:text-sky-400" >Gửi lời mời</Button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-6">

                <div className="flex-[2]">
                    <label className="text-lg text-gray-400 dark:text-gray-400 font-bold">Bài viết </label>

                    {post.length !== 0 &&
                        post.map((v, i) => (
                            <Post key={i} post={v} />
                        ))
                    }
                </div>

                <div className="flex-1 ">
                    <label className="text-lg text-gray-400 dark:text-gray-400 font-bold">Bạn bè </label>
                    <div className=" p-2 my-2 ">
                        <FriendList />
                    </div>
                </div>
            </div>
        </div>
    )
}
