import { RootState } from "@/store";
import { axiosBaseQuery } from "@/utils/axios.util";
import { AxiosClient } from "@/utils/http";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userApi } from "./user.service";

export interface LoginFormData extends Pick<User, 'username' | 'password'> { }
export interface RegisterFormData extends Pick<User, 'username' | 'password' | 'firstname' | 'lastname'> {
    rePassword: string
    gender: string
    dayBirth: string
    monthBirth: string
    yearBirth: string
}
export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: ['User', 'Auth'],
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/auth',
        prepareHeaders: (header, { getState }) => {
            header.set('authorization', (getState() as RootState).auth.accessToken || '')
        }
    }),
    endpoints: build => ({
        registerUser: build.mutation<UserRegisterRes, RegisterFormData>({
            query: (payload) => {
                return { url: '/register', method: 'POST', body: payload }
            },
        }),
        userLogin: build.mutation<UserLoginRes, LoginFormData>({
            query: (payload) => {
                return {
                    url: '/login', method: 'POST', body: payload
                }
            },
        }),
        refreshToken: build.mutation<UserRefreshTokenRes, string>({
            query: (token) => {
                return {
                    url: '/refreshToken', method: 'POST', headers: { 'x-header-token': token }
                }
            },
            // onQueryStarted: async (token, { dispatch, queryFulfilled, }) => {
            //     // `onStart` side-effect  
            //     try {
            //         const { data } = await queryFulfilled
            //         // `onSuccess` side-effect 
            //     } catch (err) {
            //         // `onError` side-effect 
            //     }
            // }
        }),
    })
})
export const {
    useRegisterUserMutation,
    useUserLoginMutation,
    useRefreshTokenMutation
} = authApi
