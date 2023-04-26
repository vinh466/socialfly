import { WithRoomMember } from "@/utils/prisma.helper";
import { ChatRoom } from "@prisma/client";

export type Room = Record<string, { name: string }>
export type RoomChatLog = WithRoomMember<Omit<ChatRoom & {
    userChatRooms: {
        user: {
            username: string;
            firstname: string | null;
            lastname: string | null;
            avatar: string | null;
        };
        isActive: boolean;
        chatRoom: ChatRoom;
    }[];
}, "userChatRooms">> | null
// export interface CallMessage {
//     type: string
//     messageBody: any
// }
export interface Message {
    id: string
    createdAt: Date
    messageBody: string
    messageSystem?: any
    parentIs: Omit<Message, "parentIs"> | null
    creator: {
        username: string
        firstname: string | null
        lastname: string | null
        avatar: string | null
    }
}
export interface MessageReq extends Pick<Message, "messageBody"> {
    parentId?: string | null
    chatRoomId: string
}
export type ChatLog = Message[] | null
