import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from "./helper";
import { ChatLog, ChatLogRes, RoomListRes } from '@/types/chat.type';


export const chatApi = createApi({
    reducerPath: 'chatApi',
    tagTypes: ['Chat'],
    baseQuery: baseQueryWithReauth({
        baseUrl: '/api/chat',
    }),
    endpoints: build => ({
        getRoomList: build.query<RoomListRes, void>({
            query: () => ({ url: '/room' }),
            providesTags: [{ type: 'Chat', id: 'list' }]
        }),
        getChatLog: build.query<ChatLogRes, string>({
            query: (roomId) => ({ url: '/room/' + roomId + '/chatLog' }),
            providesTags: [{ type: 'Chat', id: 'list' }, { type: 'Chat', id: 'chatLog' }]
        }),
    }),
})

export const {
    useGetRoomListQuery, useGetChatLogQuery
} = chatApi 