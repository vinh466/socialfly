import { combineReducers, configureStore } from '@reduxjs/toolkit';

import chatReducer from '@/store/chat.slice';
import authReducer from '@/store/auth.slice';
import { useDispatch } from 'react-redux';
import { Middleware } from "@reduxjs/toolkit";

export const StoreLogger: Middleware = api => next => action => {
    // Do stuff
    const state = api.getState()
    console.log('Action', action);
    return next(action);
};

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        auth: authReducer
    },
    // middleware: (getDefaultMiddleware) => {
    //     return getDefaultMiddleware().concat(StoreLogger)
    // },
})


export type RootState = ReturnType<typeof store.getState> // Infer the `RootState` and `AppDispatch` types from the store itself 
export type AppDispatch = typeof store.dispatch // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export const useAppDispatch = () => useDispatch<AppDispatch>()