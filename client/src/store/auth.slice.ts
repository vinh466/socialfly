import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import http from '@/utils/http';
import { localStorageService } from '@/services/localStorage.service';
import { RootState } from '.';
import { LoginFormData, RegisterFormData, authApi } from '@/services/auth.service';

// initialize userToken from local storage 

const initialState = () => ({
    userInfo: localStorageService.getUser(),
    isLogin: localStorageService.isLogin(),
    accessToken: localStorageService.getLocalAccessToken(),
    refreshToken: localStorageService.getLocalRefreshToken(),
    isRefreshToken: false,
})
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state, action: PayloadAction<undefined>) => {
            localStorageService.removeUser();
            state.accessToken = ''
            state.refreshToken = ''
            state.isLogin = false
            state.userInfo = null
        },
        setAvatar: (state, action: PayloadAction<string>) => {
            state.userInfo = {
                ...state.userInfo!,
                avatar: action.payload
            }
        },
        setAccessToken: (state, action) => {
            localStorageService.removeUser();
            state.accessToken = action.payload
        },
    },
    extraReducers: (builder) => {
        // * register user 
        builder
            .addMatcher(authApi.endpoints.registerUser.matchFulfilled, (state, { payload }) => {
                localStorageService.setUser({ ...payload })
                state.userInfo = payload
                state.accessToken = payload.accessToken
                state.refreshToken = payload.refreshToken
                state.isLogin = true

            })
            .addMatcher(authApi.endpoints.registerUser.matchRejected, (state) => {
                state.isLogin = false
            })
        // * login user
        builder
            .addMatcher(authApi.endpoints.userLogin.matchFulfilled, (state, { payload }) => {
                localStorageService.setUser({ ...payload })
                state.userInfo = payload
                state.accessToken = payload.accessToken
                state.refreshToken = payload.refreshToken
                state.isLogin = true

            })
            .addMatcher(authApi.endpoints.userLogin.matchRejected, (state) => {
                state.isLogin = false
            })
        // * refresh token
        builder
            .addMatcher(authApi.endpoints.refreshToken.matchPending, (state) => {
                state.isRefreshToken = true

            })
            .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, { payload }) => {
                localStorageService.setUser({ ...payload })
                state.userInfo = payload
                state.accessToken = payload.accessToken
                state.isRefreshToken = false
                state.isLogin = true

            })
            .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state, { payload, error }) => {
                if (error.message !== "Aborted") {
                    state.isLogin = false
                    state.isRefreshToken = false
                }
            })
    }
}
)

export const authAction = { ...authSlice.actions }
export default authSlice.reducer