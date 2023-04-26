import { authApi } from '@/services/auth.service';
import { RootState, useAppDispatch } from '@/store';
import { authAction } from '@/store/auth.slice';
import { chatAction } from '@/store/chat.slice';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket.type';
import Peer from 'peerjs';
import React, { createContext, ReactNode, useState, useLayoutEffect, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3200')
export interface SocketContextValue {
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
    isConnected: boolean
}
export const SocketContext = createContext<SocketContextValue | null>(null)

type PropType = {
    children: ReactNode;
}

const SocketProvider = (props: PropType) => {
    const dispatch = useAppDispatch()
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isRefeshSocketAuth, setIsRefeshSocketAuth] = useState(socket.connected);
    const {
        auth: { userInfo, accessToken, isRefreshToken, refreshToken, isLogin },
        chat: { callStatus }
    } = useSelector((state: RootState) => state);

    useEffect(() => {
        socket.removeAllListeners()
        socket.on('connect', () => {
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });
        // listen a call
        socket.on('chatServer_callRequest', (payload) => {
            console.log('chatServer_callRequest', payload);
            if (payload.data) {
                const { chatRoomId, peers, roomInfo, type } = payload.data
                const username = userInfo?.username || ''
                if (callStatus === 'nocall') {
                    dispatch(chatAction.setCallRequest({ username, request: payload.data }))
                }
                if (['waitting', 'calling'].includes(callStatus) && userInfo?.username) {
                    socket.emit('chatClient_callResponse', {
                        body: {
                            chatRoomId, type: 'busy', peerId: userInfo.username
                        }
                    })
                }
            }
        })
        socket.on('chatServer_callResponse', (payload) => {
            console.log('chatServer_callResponse', payload);
            // payload.data && toast(payload.data.peerId + payload.data.type)
            if (payload.data) dispatch(chatAction.setCallResponse({ ...payload.data, meta: payload.meta }))
            if (['has join', 'has left'].includes(payload.data.type)
                && payload.meta?.participants instanceof Array) {
                //! invalid type
                dispatch(chatAction.setCallParticipants(payload.meta.participants as any))
            }
            if (payload.data.type === 'time out') {
                dispatch(chatAction.setCallRequest())
            }
        })

        // listen chat data
        socket.on('chatServer_sendRoomList', (payload) => {
            dispatch(chatAction.setChatRoomList({
                username: userInfo?.username || '',
                rooms: payload.data
            }))
        })
        socket.on('chatServer_sendChatLog', (payload) => {
            dispatch(chatAction.setChatLog({
                chatRoomId: payload.meta?.chatRoomId as string || '', logs: payload.data
            }))
        })
        socket.on('chatServer_sendRoom', (payload) => {
            dispatch(chatAction.setChatRoomInfo({
                username: userInfo?.username || '', room: payload.data
            }))
        })
        // refetch chat data when get new message
        socket.on('chatServer_newMessage', (payload) => {
            socket.emit('chatClient_getRoomList',)
            socket.emit('chatClient_getRoom', { body: { chatRoomId: payload.data.chatRoomId } })
            socket.emit('chatClient_getChatLog', { body: { chatRoomId: payload.data.chatRoomId } })
        })


        socket.on("connect_error", (err) => {
            console.log('connect_error: ' + err.message);
            if (err.message == 'unauthorized') {
                setIsRefeshSocketAuth(true)
            }
        });

        socket.emit('chatClient_getRoomList',)
        return () => {
            socket.removeAllListeners()
        };
    }, [])

    //socket auth
    useEffect(() => {
        if (!isRefreshToken && refreshToken && isLogin) {
            dispatch(authApi.endpoints.refreshToken.initiate(refreshToken,));
        }
        setIsConnected(false);
        setIsRefeshSocketAuth(false)
    }, [isRefeshSocketAuth])
    useEffect(() => {
        if (!isLogin) dispatch(chatAction.reset())
        const clear = setTimeout(() => {
            socket.disconnect();
            socket.auth = {
                token: accessToken
            }
            accessToken && socket.connect();
        }, 500);
        return () => clearTimeout(clear)
    }, [accessToken, isLogin])

    return (
        <SocketContext.Provider value={{ socket, isConnected, } as SocketContextValue}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;