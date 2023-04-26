import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import http from '@/utils/http';
import { localStorageService } from '@/services/localStorage.service';
import { RootState } from '.';
import { userApi } from '@/services/user.service';

// initialize userToken from local storage 

const initialState = () => ({
    loading: false,
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            userApi.endpoints.getFriends.matchFulfilled,
            (state, { payload }) => {
                state.loading = true
            }
        )
    },
}
)

export const userAction = { ...userSlice.actions }
export default userSlice.reducer