import Button from '@/components/Button';
import FriendRecommendList from '@/components/FriendRecommendList';
import Post from '@/components/Post';
import { RootState } from '@/store';
import React from 'react'
import { BsCameraVideoFill, BsFillChatQuoteFill, BsTelephoneFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Feed() {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    return (
        <div className="flex gap-3">
            <div className="flex-[3]">
                <div className="">
                    <div className="flex flex-row flex-wrap gap-4 ">
                        <div className='background w-full p-3'>
                            <label className="text-xl text-gray-500 dark:text-gray-300 font-bold">Hãy đăng gì đó </label>
                            <div className="flex flex-row py-3">
                                <img src={userInfo?.avatar || '/public/no-avatar.png'} className="rounded-4xl" alt="avatar" width={50} height={50} />

                                <input type="search" className="flex-1 ml-3 w-1/2 bg-slate-200 p-2 rounded-lg hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600" placeholder="Bạn đang nghĩ gì ..." />
                            </div>
                        </div>

                        {true ?
                            [0, 1,].map((v, i) => (
                                <Post key={i} />
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
