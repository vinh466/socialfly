import { ChatLog, Message, Room, isCallSystemMessage } from "@/types/chat.type"

export interface RoomInfo extends Omit<Room, 'avatar' | 'name'> {
    roomName: string
    roomAvatar: string
}

export function formatChatLog(chatLog: Message[]) {
    const chatLogFormat = [] as Array<Message | Message[]>
    chatLog.forEach((message, index, arr) => {
        if (index === 0) return chatLogFormat.push(message)
        const prevMessage = arr[index - 1]
        const diffDate = Math.abs((new Date(message.createdAt)).getTime() - (new Date(prevMessage.createdAt)).getTime())
        if (diffDate < 1000 * 60 * 10 && prevMessage.creator.username === message.creator.username) {
            const tmp = chatLogFormat[chatLogFormat.length - 1]
            if (tmp instanceof Array) {
                tmp.unshift(message)
            } else {
                chatLogFormat[chatLogFormat.length - 1] = [message, prevMessage]
            }
        } else {
            return chatLogFormat.push(message)
        }
    })
    return chatLogFormat
}
export function getRoomInfo(username: string, room: Room): RoomInfo {
    const { name, avatar, ...restRoom } = room
    let roomName = 'Phòng Chat'
    let roomAvatar = ''
    if (!avatar || !name) {
        if (room.memberNum === 2) {
            const users = room.userChatRooms
            roomName = users[0]?.username !== username ?
                [users[0].firstname, users[0].lastname].join(' ') :
                [users[1].firstname, users[1].lastname].join(' ')
            roomAvatar = users[0]?.username !== username ? users[0]?.avatar : users[1]?.avatar
        } else {
            roomName = room.userChatRooms.map((e) => {
                return [e.firstname].join(' ') || e.username || 'unknown'
            }).join(', ')
        }
    }
    if (!roomAvatar) roomAvatar = '/public/no-avatar.png'
    if (avatar) roomAvatar = avatar
    if (name) roomName = name
    return {
        ...restRoom,
        roomName,
        roomAvatar
    };
}