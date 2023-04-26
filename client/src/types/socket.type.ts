import { ChatLog, Message, MessageReq, Room } from "./chat.type";
import { ClientCallResponse, MessageFromPeer, MessageToPeer, ServerCallResponse } from "./chatRTC.type";

export interface ServerEmit<T> {
    data: T
    meta?: {
        [key: string]: string | string[] | { [key: string]: string }[]
    }
}
export interface ClientEmit<T> {
    body?: T
}
export interface ServerToClientEvents {
    chatServer_newMessage: ({ }: ServerEmit<{
        message: Message,
        chatRoomId: string
    }>) => void
    chatServer_sendChatLog: ({ }: ServerEmit<Message[]>) => void
    chatServer_sendRoom: ({ }: ServerEmit<Room>) => void
    chatServer_sendRoomList: ({ }: ServerEmit<Room[]>) => void

    chatServer_callRequest: ({ }: ServerEmit<MessageFromPeer>) => void
    chatServer_callResponse: ({ }: ServerEmit<ServerCallResponse>) => void
}

export interface ClientToServerEvents {
    chatClient_getRoom: ({ }: ClientEmit<{ chatRoomId: string }>) => Promise<void>
    chatClient_getRoomList: () => Promise<void>
    chatClient_getChatLog: ({ }: ClientEmit<{ chatRoomId: string }>) => Promise<void>
    chatClient_sendRoomMessage: ({ }: ClientEmit<MessageReq>, cb: ({ }: { status: string }) => void) => Promise<void>

    chatClient_callRequest: ({ }: ClientEmit<MessageToPeer>) => void
    chatClient_callResponse: ({ }: ClientEmit<ClientCallResponse>) => void
    chatClient_acceptCallRequest: () => void
    chatClient_endCall: () => void
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    username: string | undefined;
}