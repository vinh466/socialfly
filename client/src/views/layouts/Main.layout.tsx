import Button from "@/components/Button";
import { Link, useLoaderData, Outlet } from "react-router-dom";
import { BsBell, BsArrowReturnRight, BsNewspaper, BsPeopleFill, BsFillChatQuoteFill } from "react-icons/bs";
import ThemeToggleBtn from "@/components/ThemeToggleBtn";

export default function Root() {
    // const { contacts } = useLoaderData();
    return (
        <div className="container mx-auto flex flex-row">
            <div id="sidebar" className="flex-1">
                <div id="sidebar-wrapper" className="block ml-auto w-full max-w-[360px]">
                    <div id="header-logo" className="flex-1 h-[64px] p-2">
                        <img src="/public/socialfly-logo.png" className="block mx-auto" width={180} alt="logo" srcSet="socialfly-logo.png" />
                    </div>

                    <article
                        className="animation-bg-gradient-1 hover:shadow-sm m-3"
                    >
                        <div className="rounded-[10px] primary-bg dark:primary-bg-dark p-4 !pt-20 sm:p-6">
                            <time dateTime="2022-10-10" className="block text-xs">
                                10th Oct 2022
                            </time>

                            <a href="#">
                                <h3 className="mt-0.5 text-lg font-medium">
                                    How to center an element using JavaScript and jQuery
                                </h3>
                            </a>

                            <div className="mt-4 flex flex-wrap gap-1">
                                <span
                                    className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
                                >
                                    Snippet
                                </span>

                                <span
                                    className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
                                >
                                    JavaScript
                                </span>
                            </div>
                        </div>
                    </article>
                    <ul className="flex flex-col rounded-lg m-3 primary-bg dark:primary-bg-dark [&_li>div]:px-4 [&>li]:px-1">
                        <li>
                            <Button>
                                <BsNewspaper />
                                <Link className="block w-full p-4 " to={`/feed`}>Trang chủ</Link>
                            </Button>
                        </li>
                        <li>
                            <Button>
                                <BsPeopleFill />
                                <Link className="block w-full p-4 " to={`/friend`}>Bạn bè</Link>
                            </Button>
                        </li>
                        <li>
                            <Button>
                                <BsFillChatQuoteFill />
                                <Link className="block w-full p-4 " to={`/chat`}>Chat</Link>
                            </Button>
                        </li>
                        <li>
                            <Button>
                                <Link className="block w-full p-4 " to={`/login`}>Login</Link>
                            </Button>
                        </li>
                        <li>
                            <Button>
                                <Link className="block w-full p-4 " to={`/register`}>Register</Link>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex-[3] ">
                <div className="wrapper">
                    <header id="header" className="p-2 h-[64px] flex flex-row justify-between items-center">
                        <div className="flex-1 px-4">
                            <input type="search" className="w-full outline-none bg-slate-100 hover:bg-slate-200 focus:bg-slate-100 dark:hover:bg-slate-600 dark:bg-slate-700 dark:focus:bg-slate-700" placeholder="Tìm kiếm" />
                        </div>
                        <ul className="flex gap-3">
                            <li>
                                <Button className="p-2">
                                    <BsBell />
                                    <span className="">Thông báo</span>
                                </Button >
                            </li>
                            <li className="flex items-center">
                                <ThemeToggleBtn />
                            </li>
                            <li>
                                <Button className="p-2">
                                    <BsArrowReturnRight />
                                    <span>Đăng xuất</span>
                                </Button>
                            </li>
                        </ul>
                    </header>
                    <div id="main" className="flex-[3] m-2">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}