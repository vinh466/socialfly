import Button from "@/components/Button";
import Post from "@/components/Post";
import { RootState } from "@/store";
import { BsBoxArrowUp, BsChatSquareText, BsFillChatSquareTextFill, BsHandThumbsUp, BsHeart, BsReply, BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    return (
        <div>
            <div className="background mb-2 overflow-hidden">
                <div>
                    <div className="flex flex-row flex-wrap gap-4  max-h-[460px] custom-scrollbar overflow-y-auto">
                        <img src="/public/bg-profile.png" alt="profile bg" className="h-[200px] w-full object-cover" />
                        <div className="flex-1 flex items-center p-4"  >
                            <div className="w-32 relative">
                                <div className="background rounded-full p-1 absolute top-[-110px] z-50">
                                    <img src={userInfo?.avatar || '/public/no-avatar.png'} alt="no avatar" className="rounded-full w-28 h-28" />
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 mx-4">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="block text-xl font-bold">{userInfo?.firstname + ' ' + userInfo?.lastname}</span>
                                        <span className="block italic text-lg">@{userInfo?.username}</span>
                                    </div>
                                </div>
                                <div className="self-end mt-2">
                                    <Button border className="ml-2 py-1 px-2  text-sm text-sky-400 dark:text-sky-400" >Gửi lời mời</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-6">

                <div className="flex-[2]">
                    <label className="text-lg text-gray-400 dark:text-gray-400 font-bold">Bài viết </label>
                    <Post />
                </div>

                <div className="flex-1 ">
                    <label className="text-lg text-gray-400 dark:text-gray-400 font-bold">Bạn bè (1)</label>
                    <div className=" background p-2 my-2 ">
                        {[1, 1, 1, 1, 1].map((v, i) => (<div key={i} className="flex-1 flex items-center p-2"  >
                            <img src={'/public/no-avatar.png'} alt="no avatar" className="rounded-full w-16 h-16" />
                            <div className="flex flex-col flex-1 mx-4">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="block font-semibold">Name</span>
                                        <span className="block italic">@usrename</span>
                                    </div>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
        </div>
    )
}
