import Button from "@/components/Button";
import { Link, useLoaderData, Outlet } from "react-router-dom";
import { BsBell, BsArrowReturnRight, BsNewspaper, BsPeopleFill, BsFillChatQuoteFill, BsPersonFill, BsGearFill } from "react-icons/bs";
import ThemeToggleBtn from "@/components/ThemeToggleBtn";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { authAction } from "@/store/auth.slice";

export default function Root() {
    // const { contacts } = useLoaderData();
    const { userInfo, isLogin } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch();
    const handleLogOut = () => {
        dispatch(authAction.logOut())
    }

    return (
        <div className="container mx-auto flex flex-row">

            <div className="wrapper flex w-full h-full min-h-screen flex-col">
                <div className="h-[64px]">
                    <div className="container fixed px-2 z-[999]">
                        <header id="header" className=" p-1 h-[64px] flex flex-row gap-2 justify-between items-center rounded-br-lg rounded-bl-lg dark:border-solid dark:border-b dark:border-slate-500 primary-bg dark:primary-bg-dark ">

                            <div id="header-logo" className="flex-1 max-w-[360px]">
                                <img src="/socialfly-logo.png" className="block mx-auto" width={180} alt="logo" srcSet="socialfly-logo.png" />
                            </div>
                            <div className="flex-[3] flex mx-2 items-center">
                                <div className="flex-[3]">
                                    <input type="search" className="w-full outline-none bg-slate-100 p-2 rounded-lg hover:bg-slate-300 focus:bg-gray-300  dark:bg-slate-600 dark:hover:bg-slate-500 dark:focus:bg-gray-600" placeholder="Tìm kiếm" />
                                </div>
                                <ul className="flex-1 flex justify-end gap-3">
                                    <li>
                                        <Button className="p-2" >
                                            <span className="flex items-center text-base leading-4">
                                                <BsBell className="mr-2" />
                                                Thông báo
                                            </span>
                                        </Button >
                                    </li>
                                    <li className="flex items-center">
                                        <ThemeToggleBtn />
                                    </li>
                                    <li>
                                        <Button className="p-2" onClick={handleLogOut}>
                                            <span className="flex items-center text-base leading-4">
                                                <BsArrowReturnRight className="mr-2" />
                                                Đăng xuất
                                            </span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </header>
                    </div>
                </div>
                <div id="main" className="m-2 flex-1 flex gap-5">
                    <div className="flex-1 max-w-[360px] mb-2 hidden lg:block">
                        <div id="sidebar" className="fixed w-full max-w-[245px] xl:max-w-[360px] mb-2">
                            <div id="sidebar-wrapper" className="block w-full ">

                                {userInfo &&
                                    <div className="flex items-center rounded-lg mb-2 primary-bg dark:primary-bg-dark">
                                        <div className="p-4">
                                            <Link className="" to={`/profile`}>
                                                <img src={userInfo.avatar || '/no-avatar.png'} className="w-16 h-16 object-cover rounded-4xl" alt="avatar" width={50} height={50} />
                                            </Link>
                                        </div>
                                        <div className="flex-1 flex flex-col p-2  ">
                                            <span className="text-lg font-bold">{userInfo.firstname + ' ' + userInfo.lastname}</span>
                                            <span className="italic text-sm ">@{userInfo.username}</span>
                                        </div>
                                        <div>
                                            <Button className="py-3 px-4 mr-2">
                                                <BsGearFill />
                                            </Button>
                                        </div>
                                    </div>
                                }

                                <ul className="flex flex-col rounded-lg primary-bg dark:primary-bg-dark [&>li]:p-1">
                                    <li>
                                        <Button className="w-full">
                                            <Link className="w-full flex items-center p-4" to={`/feed`}>
                                                <BsNewspaper className="mr-2" />
                                                Trang chủ
                                            </Link>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button className="w-full">
                                            <Link className=" w-full flex items-center p-4" to={`/friend`}>
                                                <BsPeopleFill className="mr-2" />
                                                Bạn bè
                                            </Link>
                                        </Button>
                                    </li>
                                    <li>
                                        <Button className="w-full">
                                            <Link className=" w-full flex items-center p-4" to={`/chat`}>
                                                <BsFillChatQuoteFill className="mr-2" />
                                                Chat
                                            </Link>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex-[3]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}