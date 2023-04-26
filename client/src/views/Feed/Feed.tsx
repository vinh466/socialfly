import Button from '@/components/Button';
import FriendRecommendList from '@/components/FriendRecommendList';
import Post, { PostField } from '@/components/Post';
import { RootState } from '@/store';
import React, { useEffect, useState } from 'react'
import { BsCameraVideoFill, BsFillChatQuoteFill, BsTelephoneFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PostCreate from './PostCreate';
import axios, { AxiosError } from 'axios';

export default function Feed() {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    const [post, setPost] = useState<Array<PostField>>([])
    async function getPost(signal?: AbortSignal) {
        try {
            const result = await axios.get<Array<PostField>>('http://localhost:3200/api/post/getNewfeed', {
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
        <div className="flex gap-3">
            <div className="flex-[3]">
                <div className="">
                    <div className="flex flex-row flex-wrap gap-4 ">
                        <PostCreate onUpdate={() => getPost()} />
                        {post.length !== 0 ?
                            post.map((v, i) => (
                                <Post key={i} post={v} />
                            )) :
                            <div className="w-full background py-10 text-center">
                                <span className="font-bold ">Hãy thêm một vài người bạn để nhận bài viết của mọi người!</span>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="flex-1 hidden md:block">
                <label className="text-xl text-gray-500 dark:text-gray-300 font-bold">Gợi ý bạn bè </label>
                <FriendRecommendList />
            </div>
        </div>
    )
}
