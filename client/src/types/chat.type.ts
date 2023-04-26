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
export interface SystemMessage {
    id: string
    messageBody: Array<any>
    type: 'video call' | 'notice' | 'call' | 'system'
    createAt: string
}
export interface CallSystemMessage extends SystemMessage {
    messageBody: Array<{
        time: number,
        createdAt: string
    }>
    type: 'video call' | 'call'
}
export interface Message {
    id: string
    createdAt: string
    messageBody: string
    messageSystem?: SystemMessage
    parentIs: Omit<Message, "parentIs"> | null
    creator: {
        username: string
        firstname: string | null
        lastname: string | null
        avatar: string | null
    }
}
export function isCallSystemMessage(obj: SystemMessage): obj is CallSystemMessage {
    if (
        ['video call', 'call'].includes(obj.type) &&
        obj.messageBody.length
    ) {
        return true
    }
    return false
}
export interface MessageReq extends Pick<Message, "messageBody"> {
    parentId: string | null
    chatRoomId: string
}
export type ChatLog = Array<Message | Message[]>
export interface RoomUser {
    chatRoomId?: string
    username: string
    firstname: string
    lastname: string
    avatar: string
    isActive: boolean
    createdAt: string
}
export interface Room {
    id: string
    name?: string
    memberNum: number
    avatar?: string
    isActive: boolean
    createdAt: string
    userChatRooms: RoomUser[],
    newestMessage: Message
}
export interface RoomListRes {
    data: Room[]
    meta: { [key: string]: string }
}
export interface ChatLogRes {
    data: Message[]
    meta: { [key: string]: string }
}
export interface CallParticipant {
    peerId: string
    status: 'connect' | 'watting' | 'deny' | 'cannot' | 'cancel'
} 