import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from "./helper";


export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User', 'Auth'],
    baseQuery: baseQueryWithReauth({
        baseUrl: '/api/user',
    }),
    endpoints: build => ({
        getRecommend: build.query<UserCardResult, void>({
            query: () => ({ url: '/getRecommend' }),
            providesTags: [{ type: 'User', id: 'list' }]
        }),
        getFriends: build.query<FriendCardResult, void>({
            query: () => ('/getFriends'),
            providesTags: [{ type: 'User', id: 'list' }]
        }),
        getFriendRequest: build.query<UserCardResult, void>({
            query: () => ('/getFriendRequest'),
            providesTags: [{ type: 'User', id: 'list' }]
        }),
        sendFriendRequest: build.mutation<FriendRequestResult, { recipient: string }>({
            query: ({ recipient }) => {
                return {
                    url: '/sendFriendRequest',
                    method: 'POST',
                    body: { recipient },

                }
            },
            invalidatesTags: [{ type: 'User', id: 'list' }]
        }),
        acceptFriendRequest: build.mutation<FriendRequestResult, { isAccept: boolean, recipient: string }>({
            query: ({ isAccept, recipient }) => {
                return {
                    url: '/acceptFriendRequest',
                    method: 'POST',
                    body: { recipient, isAccept }
                }
            },
            invalidatesTags: [{ type: 'User', id: 'list' }]
        })
    }),
})

export const {
    useGetRecommendQuery,
    useGetFriendsQuery,
    useGetFriendRequestQuery,
    useAcceptFriendRequestMutation,
    useSendFriendRequestMutation
} = userApi 