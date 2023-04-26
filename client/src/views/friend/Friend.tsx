import Button from "@/components/Button";
import FriendRecommendList from "@/components/FriendRecommendList";
import FriendRequestList from "./components/FriendRequestList";
import FriendList from "./components/FriendList";

export default function Friend() {

    return (
        <div className="flex gap-3">
            <div className="flex-[3]">
                <div className=" ">
                    <label className="text-2xl text-gray-500 dark:text-gray-300 font-bold">Yêu cầu kết bạn </label>
                    <FriendRequestList />
                </div>
                <div className=" ">
                    <label className="text-2xl text-gray-500 dark:text-gray-300 font-bold">Bạn bè </label>
                    <FriendList />
                </div>
            </div>
            <div className="flex-1">
                <label className="text-xl text-gray-500 dark:text-gray-300 font-bold">Gợi ý bạn bè </label>
                <FriendRecommendList />
            </div>
        </div>
    )
}
