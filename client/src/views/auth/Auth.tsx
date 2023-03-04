import Button from "@/components/Button";
import { useEffect, useLayoutEffect, useState } from "react"
import { Link, Navigate, redirect, useLocation, useNavigate } from "react-router-dom"
import LoginForm, { LoginFormData } from "./components/LoginForm";
import RegisterForm, { RegisterFormData } from "./components/RegisterForm";
import { RootState, useAppDispatch } from "@/store";
import { useSelector } from "react-redux";
import { authAction } from "@/store/auth.slice";
import authBg from "@/assets/images/auth-bg.png"
import ThemeToggleBtn from "@/components/ThemeToggleBtn";


function Auth() {
    const [auth, setAuth] = useState('login')
    const path = useLocation();
    const { isLogin } = useSelector((state: RootState) => state.auth);


    useEffect(() => {
        setAuth(path.pathname.slice(1))
    }, [path.pathname])

    const dispatch = useAppDispatch()
    const handleLogin = (data: LoginFormData) => {
        console.log(data);
        try {
            dispatch(authAction.userLogin(data))
        } catch (err) {
            console.log(err);
        }
    }
    const handleRegister = (data: RegisterFormData) => {
        console.log(data);
        try {
            dispatch(authAction.registerUser(data))
        } catch (err) {
            console.log(err);
        }
    }
    return isLogin ?
        <Navigate to={'/'} />
        :
        <div className="w-full h-[100vh] flex">
            <div className="flex-[2] relative bg-sky-100 dark:bg-slate-900">
                <div className="w-full h-full opacity-[0.4] dark:opacity-[0.4]" style={{ backgroundImage: `url(${authBg})` }}></div>
                <img className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10" src="/public/socialfly-640x200.png" alt="" />
            </div>
            <div className="flex-1 h-full flex flex-col p-4">
                <ThemeToggleBtn className="self-end" />
                <div className="flex-1 pt-10">
                    <div className="text-center">
                        <Button active={auth === 'login'}
                        >
                            <Link className="w-full flex items-center p-4" to={`/login`}>
                                {/* <BsNewspaper className="mr-2" /> */}
                                Đăng nhập
                            </Link>
                        </Button>
                        <Button active={auth === 'register'}>
                            <Link className="w-full flex items-center p-4" to={`/register`}>
                                {/* <BsNewspaper className="mr-2" /> */}
                                Đăng ký
                            </Link>
                        </Button>
                    </div>
                    <div className="w-full flex justify-center items-center px-6">
                        {auth === 'login' &&
                            <LoginForm className="flex-1 fade-in-left" onSubmit={handleLogin} />
                        }
                        {auth === 'register' &&
                            <RegisterForm className="flex-1 fade-in-right" onSubmit={handleRegister} />
                        }
                    </div>
                </div>
            </div>
        </div>

}

export default Auth