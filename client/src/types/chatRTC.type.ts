import { RoomInfo } from "@/utils/chat.util"
import { Room } from "./chat.type"

export interface MessageFromPeer {
    chatRoomId: string
    roomInfo: Room
    peers: Array<string>
    type: 'call' | 'video call'
}
export interface MessageToPeer {
    chatRoomId: string
    peerId: string
    type: 'video call' | 'call'
}

export interface PeerMessage {
    chatRoomId: string
    peerId: string
}
export interface ServerCallResponse {
    chatRoomId: string
    peerId: string
    type: 'accept' | 'deny' | 'cancel' | 'time out' | 'cannot' | 'busy' | 'has left' | 'has join' | 'has end' | 'no online'
}
export interface ClientCallResponse {
    chatRoomId: string
    peerId: string
    type: 'accept' | 'deny' | 'cancel' | 'busy'
}
export interface CallRequest extends MessageFromPeer {
    roomInfo: RoomInfo
}
export interface Call extends MessageFromPeer {
    roomInfo: RoomInfo
}