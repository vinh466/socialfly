import { BsBoxArrowUp, BsChatSquareText, BsHandThumbsUp, BsReply, BsThreeDots } from "react-icons/bs"
import Button from "./Button"

function Post() {
    return <div className=" background p-3 my-2 ">
        <div className="flex-1 min-w-[320px] flex items-center" >
            <img src={'/public/no-avatar.png'} alt="no avatar" className="rounded-full w-10 h-10 mr-4" />
            <div className="flex flex-col flex-1 ">
                <div className="flex justify-between">
                    <div>
                        <span className="block font-semibold text-sm">Name</span>
                        <span className="block italic text-xs">@usrename</span>
                    </div>
                    <div className="flex items-center">
                        <span className="block italic text-xs mr-3 text-gray-600 dark:text-gray-400">1 giờ trước</span>
                        <Button className="px-2 "><BsThreeDots /></Button>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-1 my-1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia doloribus sunt adipisci necessitatibus, odit fugiat saepe voluptatum suscipit placeat, nihil facere. Impedit tempora libero fugit sunt, eius optio! Saepe, tempore.
            Pariatur dolorum velit veritatis cumque fugit id praesentium quibusdam sed nihil ducimus reiciendis beatae facilis, a deleniti at qui accusamus deserunt? Quod sit inventore doloribus iste veritatis odit iure ad!
        </div>
        <div className="my-2">
            <img src="https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt="anh" className="w-full max-h-[600px] object-cover rounded-md" />
        </div>
        <div className="mt-4">

            <div className="flex justify-between">
                <Button className="text-sm p-2 flex items-center gap-1">
                    <BsChatSquareText /><span> Bình luận</span>
                </Button>
                <div className="flex">
                    <Button className="text-sm p-2 flex items-center gap-1">
                        <BsBoxArrowUp /> <span>Chia sẻ</span>
                    </Button>
                    <Button className="text-sm p-2 flex items-center gap-1">
                        <BsHandThumbsUp /><span> Thích</span>
                    </Button>
                </div>
            </div>

            <div>
                <div>
                    <div className="flex mt-3 mb-1">
                        <img src="/public/no-avatar.png" alt="avatar" className="w-10 h-10 rounded-full p-1" />
                        <div className=" ml-2">
                            <div className="flex flex-col rounded px-3 bg-slate-200 dark:bg-gray-600">
                                <span className="font-bold">Name</span>
                                <span>Lorem </span>
                            </div>
                        </div>
                    </div>
                    <div className="ml-12 flex items-center">
                        <Button className="text-xs p-1 flex items-center gap-1">
                            <BsHandThumbsUp /><span> Thích</span>
                        </Button>
                        <Button className="text-xs p-1 flex items-center gap-1">
                            <BsReply /><span> Trả lời</span>
                        </Button>
                        <span className="text-xs ml-3">2 giờ trước</span>
                    </div>

                    <input type="search" className="flex-1 ml-12 w-1/2 bg-slate-200 p-2 rounded-lg hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600" placeholder="Trả lời ..." />
                </div>
                <div>
                    <div className="flex mt-3 mb-1">
                        <img src="/public/no-avatar.png" alt="avatar" className="w-10 h-10 rounded-full p-1" />
                        <div className=" ml-2">
                            <div className="flex flex-col rounded-lg px-2 py-1 bg-slate-200 dark:bg-gray-600">
                                <span className="font-bold">Name</span>
                                <span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus maiores dolorem, sunt voluptate expedita dolores obcaecati corrupti maxime totam, voluptatibus recusandae odit sequi inventore ut, laboriosam nostrum optio itaque. Corporis!
                                    Sunt veniam sed accusamus aperiam! Quod eius ab voluptatibus officia minus explicabo? Doloremque, ab est expedita voluptate minus praesentium ullam, voluptatibus vitae magni tempore quas consequatur, libero enim odit eius? </span>
                            </div>
                        </div>
                    </div>
                    <div className="ml-12 flex items-center">
                        <Button className="text-xs p-1 flex items-center gap-1">
                            <BsHandThumbsUp /><span> Thích</span>
                        </Button>
                        <Button className="text-xs p-1 flex items-center gap-1">
                            <BsReply /><span> Trả lời</span>
                        </Button>
                        <span className="text-xs ml-3">2 giờ trước</span>
                    </div>

                    <input type="search" className="flex-1 ml-12 w-1/2 bg-slate-200 p-2 rounded-lg hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600" placeholder="Trả lời ..." />
                </div>
            </div>

            <div className="flex">
                <input type="search" className="flex-1 m-2 mt-5 bg-slate-200 p-2 rounded-lg hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600" placeholder="Bình luận ..." />
            </div>
        </div>
    </div>
}

export default Post