import { Socket } from 'socket.io-client';

export interface Chat {
    socket: Socket,
    username: string,
    messages?: ChatItem[],
    roomId?: string,
    rooms: object,
    conversations: [],
}

export interface ChatItem {
    message: string,
    time: string,
    username: string
}


