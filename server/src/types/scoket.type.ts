import { Message } from "@prisma/client";
import { ChatLog, MessageReq, Room, RoomChatLog } from "./chat.type";
import { ClientCallResponse, MessageFromPeer, MessageToPeer, ServerCallResponse } from "./chatRTC.type";

interface ServerEmit<T> {
    data: T
    meta?: {
        [key: string]: string | string[] | { [key: string]: string }[]
    }
}
interface ClientEmit<T> {
    body?: T
}
export interface ServerToClientEvents {
    chatServer_newMessage: ({ }: ServerEmit<{
        message: Message,
        chatRoomId: string
    }>) => void
    chatServer_sendChatLog: ({ }: ServerEmit<ChatLog>) => void
    chatServer_sendRoom: ({ }: ServerEmit<RoomChatLog>) => void
    chatServer_sendRoomList: ({ }: ServerEmit<RoomChatLog[]>) => void

    chatServer_callRequest: ({ }: ServerEmit<MessageFromPeer>) => Promise<void>
    chatServer_callResponse: ({ }: ServerEmit<ServerCallResponse>) => Promise<void>
}

export interface ClientToServerEvents {
    chatClient_getRoom: ({ }: ClientEmit<{ chatRoomId: string }>) => Promise<void>
    chatClient_getRoomList: () => Promise<void>
    chatClient_getChatLog: ({ }: ClientEmit<{ chatRoomId: string }>) => Promise<void>
    chatClient_sendRoomMessage: ({ }: ClientEmit<MessageReq>, cb: ({ }: { status: string }) => void) => Promise<void>

    chatClient_callRequest: ({ }: ClientEmit<MessageToPeer>) => void
    chatClient_callResponse: ({ }: ClientEmit<ClientCallResponse>) => void
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    username: string | undefined;
}