import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '@/store/chat.slice';
import authReducer from '@/store/auth.slice';
import userReducer from '@/store/user.slice';
import { useDispatch } from 'react-redux';
import { userApi } from '@/services/user.service';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { rtkQueryErrorLogger } from './middlewares/rtkQuery.mdw';
import { authApi } from '@/services/auth.service';
import { chatApi } from '@/services/chat.service';



export const store = configureStore({
    reducer: {
        chat: chatReducer,
        auth: authReducer,
        user: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            userApi.middleware,
            authApi.middleware,
            chatApi.middleware,
            rtkQueryErrorLogger
        )
    },
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState> // Infer the `RootState` and `AppDispatch` types from the store itself 
export type AppDispatch = typeof store.dispatch // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export const useAppDispatch = () => useDispatch<AppDispatch>()