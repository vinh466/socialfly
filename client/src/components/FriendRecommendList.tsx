import { useEffect, useState } from "react";
import Button from "./Button"
import userService from "@/services/user.service";
import { rangeArray } from "@/utils/array.util";


function FriendRecommendList() {
    const [userList, setUserList] = useState<UserCard[]>([])
    const [isLoading, setIsLoading] = useState(false)
    async function getuser(apiSignal?: AbortController) {
        const { data: user } = await userService.getRecommend(apiSignal);
        setUserList(user)
    }
    useEffect(() => {
        setIsLoading(true)
        const apiSignal = new AbortController()
        getuser(apiSignal)
        setIsLoading(false)
        return () => apiSignal.abort();
    }, [])
    async function handleSendRequset(recipient: string) {
        const { meta } = await userService.sendFriendRequest(recipient)
        if (meta?.message) getuser();
    }
    return (
        <div className="flex flex-col gap-2 my-2 background rounded-lg py-3">
            {
                userList.length ?
                    <div>
                        {userList.slice(0, 4).map((user, i) => (
                            <div className="flex-1 min-w-[240px] flex items-center py-1 px-4" key={i}>
                                <img src={user.avatar || '/public/no-avatar.png'} alt="no avatar" className="rounded-full w-16 h-16" />
                                <div className="flex flex-col flex-1 mx-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="block font-semibold">{user.firstname + ' ' + user.lastname}</span>
                                            <span className="block italic text-sm">@{user.username}</span>
                                        </div>
                                    </div>
                                    <div className="self-start mt-2">
                                        <Button onClick={() => handleSendRequset(user.username)} border className="ml-2 py-1 px-2 text-sm text-sky-400 dark:text-sky-400" >Gửi lời mời</Button>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                        <label className="text-lg text-gray-500 dark:text-gray-300 font-bold text-center">Tìm kiếm thêm</label>
                    </div>

                    :
                    isLoading ?
                        rangeArray(2).map((v, i) => (
                            <div className="p-4 max-w-sm w-full mx-auto" key={'loading-' + i}>
                                <div className="animate-pulse flex space-x-4">
                                    <div className="rounded-full bg-slate-300 h-10 w-10" />
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="h-2 bg-slate-300 rounded" />
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="h-2 bg-slate-300 rounded col-span-2" />
                                                <div className="h-2 bg-slate-300 rounded col-span-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <div className="text-gray-500 dark:text-gray-300 font-bold text-center">Không có gợi ý!</div>

            }
        </div>
    )
}

export default FriendRecommendList