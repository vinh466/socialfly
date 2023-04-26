import Button from "@/components/Button";
import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { Link, Navigate, redirect, useLocation, useNavigate } from "react-router-dom"
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { RootState, useAppDispatch } from "@/store";
import { useSelector } from "react-redux";
import { authAction } from "@/store/auth.slice";
import authBg from "@/assets/images/auth-bg.png"
import ThemeToggleBtn from "@/components/ThemeToggleBtn";
import { LoginFormData, RegisterFormData, authApi, useRegisterUserMutation, useUserLoginMutation } from "@/services/auth.service";
import { ErrorFormObject, isEntityError, isFetchBaseQueryError, isUnauthorizedError } from "@/services/helper";
import { userApi } from "@/services/user.service";
import { chatApi } from "@/services/chat.service";


function Auth() {
    const [auth, setAuth] = useState('login')
    const path = useLocation();

    const [registerUser, registerUserResult] = useRegisterUserMutation()
    const [userLogin, userLoginResult] = useUserLoginMutation()
    const { isLogin } = useSelector((state: RootState) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setAuth(path.pathname.slice(1))
    }, [path.pathname])

    const handleLogin = async (data: LoginFormData) => {
        console.log(data);
        try {
            await userLogin(data)
        } catch (err) {
            console.log(userLoginResult.error);
            console.log(err);
        } finally {
            dispatch(userApi.util.invalidateTags([{ type: 'User', id: 'list' }]))
            dispatch(chatApi.util.invalidateTags([{ type: 'Chat', id: 'list' }]))
        }
    }
    const handleRegister = async (data: RegisterFormData) => {
        console.log(data);
        try {
            await registerUser(data).unwrap()
        } catch (err) {
            console.log(err);
        } finally {
            dispatch(userApi.util.invalidateTags([{ type: 'User' }]))
            dispatch(chatApi.util.invalidateTags([{ type: 'Chat' }]))
            dispatch(authApi.util.invalidateTags([{ type: 'Auth' }]))
        }
    }

    const errorForm = useMemo(() => {
        const errorResult = auth === 'login' ? userLoginResult.error : registerUserResult.error
        if (isUnauthorizedError(errorResult)) {
            return errorResult.data.message as string
        }
        return null
    }, [userLoginResult, registerUserResult])
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
                    <div className="text-center text-red-400 font-bold">{errorForm}</div>
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