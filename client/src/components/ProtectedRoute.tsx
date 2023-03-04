import { RootState, useAppDispatch } from "@/store";
import { authAction } from "@/store/auth.slice";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";


function ProtectedRoute() {
    const { isLogin } = useSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()
    useLayoutEffect(() => {
        const promise = dispatch(authAction.refreshToken())
        return () => {
            promise.abort();
        }
    }, [isLogin])
    return (
        isLogin ? <Outlet /> : <Navigate to={'/login'} />
    )
}

export default ProtectedRoute