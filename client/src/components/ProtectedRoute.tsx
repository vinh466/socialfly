import { useRefreshTokenMutation } from "@/services/auth.service";
import { RootState, useAppDispatch } from "@/store";
import { authAction } from "@/store/auth.slice";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";


function ProtectedRoute() {
    const { isLogin, isRefreshToken, refreshToken } = useSelector((state: RootState) => state.auth)
    const [refreshTokenMutation] = useRefreshTokenMutation()
    useEffect(() => {
        isRefreshToken && refreshToken && refreshTokenMutation(refreshToken);
    }, [])
    return (
        isLogin ? <Outlet /> : <Navigate to={'/login'} />
    )
}

export default ProtectedRoute