import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { LoginFormData } from '../views/auth/components/LoginForm';
import AxiosClient from '@/utils/http';
import http from '@/utils/http';
import { localStorageService } from '@/services/localStorage.service';
import { RootState } from '.';
import { RegisterFormData } from '@/views/auth/components/RegisterForm';

// initialize userToken from local storage 

const initialState = () => ({
    loading: false,
    userInfo: localStorageService.getUser(),
    isLogin: localStorageService.isLogin(),
    accessToken: localStorageService.getLocalAccessToken(),
    refreshToken: localStorageService.getLocalRefreshToken(),
    isRefreshToken: false,
    error: null,
    success: false,
})


const registerUser = createAsyncThunk(
    'auth/register',
    async (payload: RegisterFormData, thunkApi) => {
        try {
            const { data } = await http.post<UserRegisterRes>('/auth/register',
                payload, {
                signal: thunkApi.signal
            })
            return data
        } catch (error: any) {
            // return custom error message from backend if present
            if (error.name == "AxiosError" && error.response && error.response.data) {
                return thunkApi.rejectWithValue(error.response.data)
            } else {
                return thunkApi.rejectWithValue(error.message)
            }
        }
    }
)
const userLogin = createAsyncThunk(
    'auth/login',
    async (payload: LoginFormData, thunkApi) => {
        try {
            const { data } = await http.post<UserLoginRes>('/auth/login',
                payload, {
                signal: thunkApi.signal
            })
            return data
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return thunkApi.rejectWithValue(error.response.data.message)
            } else {
                return thunkApi.rejectWithValue(error.message)
            }
        }
    }
)
const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, thunkApi) => {
        const state = thunkApi.getState() as RootState;
        try {
            const { data } = await http.post<UserRefreshTokenRes>('/auth/refreshToken', {}, {
                headers: {
                    'x-header-token': state.auth.refreshToken,
                },
                signal: thunkApi.signal
            })
            return data
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return thunkApi.rejectWithValue(error.response.data.message)
            } else {
                return thunkApi.rejectWithValue(error.message)
            }
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            localStorageService.removeUser();
            return initialState()
        }
    },
    extraReducers: (builder) => {
        builder
            // * register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                localStorageService.setUser({ ...payload })
                state.userInfo = payload
                state.accessToken = payload.accessToken
                state.refreshToken = payload.refreshToken
                state.loading = false
                state.success = true
                state.isLogin = true
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false
                state.isLogin = false
            })
        builder
            // * login user
            .addCase(userLogin.pending, (state) => {
                state.loading = true
                state.error = null
            },)
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                localStorageService.setUser({ ...payload })
                state.userInfo = payload
                state.accessToken = payload.accessToken
                state.refreshToken = payload.refreshToken
                state.loading = false
                state.isLogin = true
            },)
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.loading = false
                state.isLogin = false
            },)
        builder
            // * refresh token user
            .addCase(refreshToken.pending, (state) => {
                state.loading = true
                state.error = null
                state.isRefreshToken = true
            },)
            .addCase(refreshToken.fulfilled, (state, { payload }) => {
                localStorageService.setUser({ ...payload })
                state.userInfo = payload
                state.accessToken = payload.accessToken
                state.loading = false
                state.isRefreshToken = false
                state.isLogin = true
            },)
            .addCase(refreshToken.rejected, (state, { payload, error }) => {
                if (error.message !== "Aborted") {
                    state.isLogin = false
                    state.isRefreshToken = false
                    state.loading = false
                }
            },)
    }
}
)

export const authAction = { ...authSlice.actions, registerUser, userLogin, refreshToken }
export default authSlice.reducer