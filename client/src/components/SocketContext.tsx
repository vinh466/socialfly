import { RootState, useAppDispatch } from '@/store';
import { authAction } from '@/store/auth.slice';
import React, { createContext, ReactNode, useState, useLayoutEffect, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';

const socket = io('http://localhost:3200')

export const SocketContext = createContext<{
    socket: Socket
    isConnected: boolean
}>({
    socket,
    isConnected: false
})

type PropType = {
    children: ReactNode;
}

const SocketProvider = (props: PropType) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const { accessToken, isRefreshToken } = useSelector((state: RootState) => state.auth)
    const { isLogin } = useSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()
    useLayoutEffect(() => {
        socket.on('connect', () => {
            console.log('connect', socket.id);
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            console.log('disconnect', socket.id);
            setIsConnected(false);
        });
        socket.on("connect_error", (err) => {
            console.log('connect_error: ' + err.message);
            if (err.message == 'unauthorized') {
                !isRefreshToken && dispatch(authAction.refreshToken());
                setIsConnected(false);
            }
        });
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('off/disconnect');
        };
    }, [socket]);
    useEffect(() => {
        socket.auth = {
            token: accessToken
        }
        socket.connect();
    }, [accessToken])


    const sendPing = () => {
        socket.emit('ping');
    }


    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;