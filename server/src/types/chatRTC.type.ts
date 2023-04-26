import { RoomChatLog } from "./chat.type"
export type Participant = {
    peerId: string
    status: 'connect' | 'watting' | 'deny' | 'cannot' | 'cancel'
}
export interface MessageFromPeer {
    chatRoomId: string
    roomInfo: RoomChatLog
    participants: Array<Participant>
    type: 'call' | 'video call'
}
export interface MessageToPeer {
    chatRoomId: string
    peerId: string
    type: 'call' | 'video call'
}

export interface PeerMessage {
    type?: 'video call' | 'call'
    chatRoomId: string
    peerId: string
    userIdList?: string[]
}

export interface ServerCallResponse {
    chatRoomId: string
    peerId: string
    type: 'accept' | 'deny' | 'cancel' | 'cannot' | 'no online' | 'busy' | 'has left' | 'has join' | 'time out' | 'has end'
}
export interface ClientCallResponse {
    chatRoomId: string
    peerId: string
    type: 'accept' | 'deny' | 'cancel' | 'busy'
}