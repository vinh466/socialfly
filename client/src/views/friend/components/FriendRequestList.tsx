import Button from "@/components/Button"
import { useAcceptFriendRequestMutation, useGetFriendRequestQuery } from "@/services/user.service";
import { useEffect, useState } from "react";

function FriendRequestList() {
    const { data, isFetching, refetch } = useGetFriendRequestQuery()
    const [acceptFriend, acceptFriendResult] = useAcceptFriendRequestMutation();

    async function handleAcceptFriend(isAccept: boolean, recipient: string) {
        acceptFriend({ isAccept, recipient })
    }
    return (
        <div className="flex flex-row flex-wrap gap-4 my-2 max-h-[460px] custom-scrollbar overflow-y-auto">
            {
                data?.data.length ? data?.data.map((user, i) => (
                    <div className="flex-1 xl:max-w-[calc(50%-10px)]  min-w-[320px] background rounded-lg flex items-center p-4" key={i}>
                        <img src={user.avatar || '/public/no-avatar.png'} alt="no avatar" className="rounded-full w-16 h-16" />
                        <div className="flex flex-col flex-1 mx-4">
                            <div className="flex justify-between">
                                <div>
                                    <span className="block font-semibold">{user.firstname + ' ' + user.lastname}</span>
                                    <span className="block italic text-sm">@{user.username}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400">1 giờ trước</span>
                                </div>
                            </div>
                            <div className="self-end mt-2">
                                <Button onClick={() => handleAcceptFriend(true, user.username)} border className="ml-2 py-1 px-2 text-sky-400 dark:text-sky-400" >Chấp nhận</Button>
                                <Button onClick={() => handleAcceptFriend(false, user.username)} border className="ml-2 py-1 px-2 text-red-400 dark:text-red-400 border-red-400" >Từ chối</Button>
                            </div>
                        </div>
                    </div>
                ))
                    :
                    <div className="w-full background py-10 text-center">
                        <span className="font-bold ">Không có yêu cầu nào!</span>
                    </div>
            }
        </div>
    )
}

export default FriendRequestList