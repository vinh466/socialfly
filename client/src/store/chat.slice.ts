import { CallParticipant, Chat, ChatItem, ChatLog, Message, Room } from '@/types/chat.type';
import { CallRequest, MessageFromPeer, ServerCallResponse } from '@/types/chatRTC.type';
import { ServerEmit } from '@/types/socket.type';
import { RoomInfo, formatChatLog, getRoomInfo } from '@/utils/chat.util';
import { PayloadAction, createAction, createReducer, createSlice } from '@reduxjs/toolkit';
import produce, { current } from 'immer';
import Peer from 'peerjs';
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'localhost:3200'
interface CallRespone extends ServerCallResponse {
    meta: any
}

interface ChatSlice {
    currRoomId?: string,

    currRoom?: Room,
    chatRoomInfo: { [key: string]: RoomInfo | undefined },
    chatLogs: { [key: string]: Array<Message | Message[]> | undefined },
    chatRoomList: RoomInfo[],

    currVideoCallId?: string
    currCallId?: string
    callRequest?: CallRequest
    callResponse?: CallRespone
    callCurrent?: CallRequest
    callParticipants: CallParticipant[]
    callStatus: 'calling' | 'waitting' | 'nocall'
}

const initialState: ChatSlice = {
    currRoomId: undefined,

    chatRoomInfo: {},
    chatLogs: {},
    chatRoomList: [],

    currVideoCallId: undefined,
    currCallId: undefined,
    callRequest: undefined,
    callResponse: undefined,
    callCurrent: undefined,
    callParticipants: [],
    callStatus: 'nocall'
}
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        reset() {
            return initialState
        },
        setCurrentRoom(state, action: PayloadAction<string>) {
            state.currRoomId = action.payload;
        },
        setChatRoomList(state, action: PayloadAction<{ username: string, rooms: Room[] }>) {
            const rooms = action.payload.rooms.map((e) => getRoomInfo(action.payload.username, e))
            state.chatRoomList = rooms
        },
        setChatLog(state, action: PayloadAction<{ chatRoomId: string, logs: Message[] }>) {
            const chatLogs = formatChatLog(action.payload.logs)
            state.chatLogs = {
                ...state.chatLogs,
                [action.payload.chatRoomId]: chatLogs
            }
        },
        setChatRoomInfo(state, action: PayloadAction<{ username: string, room: Room }>) {
            const chatRoomId = action.payload.room.id
            const roomInfo = getRoomInfo(action.payload.username, action.payload.room)
            state.chatRoomInfo = {
                ...state.chatRoomInfo,
                [chatRoomId]: roomInfo
            }
        },
        setCallRequest(state, action: PayloadAction<{ username: string, request: MessageFromPeer } | undefined>) {
            if (action.payload) {
                const chatRoomId = action.payload.request.roomInfo.id
                const roomInfo = getRoomInfo(action.payload.username, action.payload.request.roomInfo)
                state.callRequest = {
                    ...action.payload.request,
                    roomInfo,
                }
                state.chatRoomInfo = {
                    ...state.chatRoomInfo,
                    [chatRoomId]: roomInfo
                }
            } else {
                state.callRequest = undefined
            }
        },
        setCallResponse(state, action: PayloadAction<CallRespone | undefined>) {
            if (action.payload) state.callResponse = action.payload
            else state.callResponse = undefined
        },
        setCallParticipants(state, action: PayloadAction<Array<CallParticipant> | undefined>) {
            if (action.payload) state.callParticipants = action.payload
            else state.callParticipants = []
        },
        startVideoCall(state, { payload }: PayloadAction<string>) {
            if (!state.currVideoCallId && !state.currCallId) {
                state.currVideoCallId = payload
            }
        },
        startCall(state, { payload }: PayloadAction<string>) {
            if (!state.currVideoCallId && !state.currCallId) {
                state.currCallId = payload
            }
        },
        endCall(state, { payload }: PayloadAction<undefined>) {
            state.currVideoCallId = undefined
            state.currCallId = undefined
            state.callParticipants = []
            state.callRequest = undefined
            state.callResponse = undefined
            state.callStatus = 'nocall'
        }
    }
})

export const chatAction = chatSlice.actions
export default chatSlice.reducer;