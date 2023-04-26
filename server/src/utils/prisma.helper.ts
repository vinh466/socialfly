import { ChatRoom } from "@prisma/client";

type ChatRoomId = {
    userChatRooms: {
        chatRoomId: string;
    }[]
}
export type WithChatRoomId<T> = T & {
    chatRoomId: string
}
type UserCardWithRoomId = {
    [key: string]: string &
    {
        userChatRooms: {
            chatRoomId: string;
        }[];
    }
}[]
// Take objects that satisfy FirstLastName and computes a full name
export function computeChatRoomId<UserCardWithRoomId extends ChatRoomId>(
    user: UserCardWithRoomId
): WithChatRoomId<Omit<UserCardWithRoomId, "userChatRooms">> {
    const { userChatRooms, ...newUser } = user
    return {
        ...newUser,
        chatRoomId: user.userChatRooms[0]?.chatRoomId || '',
    }
}

type RoomMember = {
    username: string;
    firstname: string | null;
    lastname: string | null;
    avatar: string | null;
}
interface ChatRoomMember {
    userChatRooms: {
        user: RoomMember
    }[]
}
export type WithRoomMember<T> = T & {
    userChatRooms: RoomMember[],
    newestMessage: any
}
// Take objects that satisfy FirstLastName and computes a full name
export function computeRoomWithMember<ChatRoom extends ChatRoomMember>(
    room: ChatRoom,
    newestMessage: Array<any>
): WithRoomMember<Omit<ChatRoom, "userChatRooms">> {
    const { userChatRooms, ...newUser } = room
    const newuserChatRooms = userChatRooms.map((v, i) => v.user)
    return {
        ...newUser,
        newestMessage: newestMessage[0],
        userChatRooms: newuserChatRooms,
    }
}
// Exclude keys from user
function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
): Omit<User, Key> {
    for (let key of keys) {
        delete user[key]
    }
    return user
}