import { Chat, ChatItem } from '@/types/chat.type';
import { PayloadAction, createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import produce, { current } from 'immer';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'localhost:3200'

interface ChatSlice {
    socket?: any,
    username: string,
    messages?: ChatItem[],
    roomId?: string,
    rooms: object,
    conversations: [],
}

const initialState: ChatSlice = {
    username: '',
    socket: undefined,
    messages: [],
    roomId: '',
    rooms: {},
    conversations: [],
}
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUsername(state, action: PayloadAction<string>) {
            console.log('setUsername:', action.payload);
            state.username = action.payload;
        },
        sendMesageReq(state, action: PayloadAction<any>) {
            console.log('sendMesageReq');
        },
        updateChatLog(state, action: PayloadAction<any>) {
            console.log('updateChatLog');
        },
        createRoomReq(state) {
            console.log('createRoomReq');
        },
        createRoomSuccess(state, action: PayloadAction<any>) {
            console.log('createRoomSuccess');
        },
        createRoomError(state, action: PayloadAction<any>) {
            console.log('createRoomError');
            state.messages?.at
            console.log(action.payload);
        },
        joinRoomReq(state) {
            console.log('joinRoomReq');
        },
        joinRoomSuccess(state, action: PayloadAction<any>) {
            console.log('joinRoomSuccess');
        },
        joinRoomError(state, action: PayloadAction<any>) {
            console.log('joinRoomError');
            console.log(action.payload);
        },
    }
})

export const chatAction = chatSlice.actions
export default chatSlice.reducer;