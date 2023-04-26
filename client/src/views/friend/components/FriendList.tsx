import Button from "@/components/Button"
import { useGetFriendsQuery } from "@/services/user.service";
import { useEffect, useState } from "react";
import { BsCameraVideoFill, BsFillChatQuoteFill, BsTelephoneFill } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"

function FriendList() {
    const { data, isFetching, refetch } = useGetFriendsQuery()
    const navigate = useNavigate()
    return (
        <div className="flex flex-row flex-wrap gap-4 my-2 ">
            {
                data?.data.length ? data?.data.map((user, i) => (
                    <div className="flex-1 xl:max-w-[calc(50%-10px)]  min-w-[320px] background rounded-lg flex items-center p-4" key={i}>
                        <img src={user.avatar || '/public/no-avatar.png'} alt="no avatar" className="rounded-full w-16 h-16 object-cover" />
                        <div className="flex flex-col flex-1 mx-4">
                            <div className="flex justify-between">
                                <div>
                                    <span className="block font-semibold">{user.firstname + ' ' + user.lastname}</span>
                                    <span className="block italic text-sm">@{user.username}</span>
                                </div>
                                <div className="flex items-center">
                                    <Link className=" w-full flex items-center" to={`/chat/${user.chatRoomId}`}>
                                        <Button className="p-3 px-4 rounded-full">
                                            <BsFillChatQuoteFill />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )) :
                    <div className="w-full background py-10 text-center">
                        <span className="font-bold ">Hãy thêm một vài người bạn, họ sẽ được hiển thị ở đây!</span>
                    </div>
            }
        </div>
    )
}

export default FriendList