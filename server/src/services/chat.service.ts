import { MessageReq } from "@/types/chat.type";
import { computeRoomWithMember } from "@/utils/prisma.helper";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const prisma = new PrismaClient()

const defaultUserSelect = {
    username: true,
    firstname: true,
    lastname: true,
    avatar: true,
}
async function getChatRoom(chatRoomId: string) {
    const chatRoomList = await prisma.chatRoom.findUnique({
        where: {
            id: chatRoomId
        },
        include: {
            userChatRooms: {
                select: {
                    chatRoom: true,
                    isActive: true,
                    user: {
                        select: {
                            username: true,
                            firstname: true,
                            lastname: true,
                            avatar: true,
                        }
                    }
                },
            }
        }
    })
    const newestMessage = await getChatLog(chatRoomId, { pageSize: 1, numPage: 1, startPage: 0 })
    return chatRoomList ? computeRoomWithMember(chatRoomList, newestMessage) : chatRoomList
}
async function getChatRoomList(username?: string) {
    const chatRoomList = await prisma.chatRoom.findMany({
        where: {
            userChatRooms: {
                some: { username: username, },
            }
        },
        include: {
            userChatRooms: {
                select: {
                    user: {
                        select: {
                            username: true,
                            firstname: true,
                            lastname: true,
                            avatar: true,
                        },
                    },
                },
            },

        }
    })

    const chatRooms = await Promise.all(chatRoomList.map(async (room) => {
        const newestMessage = await getChatLog(room.id, { pageSize: 1, numPage: 1, startPage: 0 })
        return computeRoomWithMember(room, newestMessage)
    }))
    // console.log(chatRooms);
    return chatRooms;
}
async function getChatLog(roomId: string, meta = {
    startPage: 0,
    numPage: 1,
    pageSize: 100
}) {
    const messageSelect = { id: true, createdAt: true, messageBody: true, }
    const take = meta.pageSize * meta.numPage
    const skip = meta.startPage * meta.pageSize
    const chatLog = await prisma.message.findMany({
        select: {
            ...messageSelect,
            messageRecipient: {
                select: {
                    recipientId: true,
                    isRead: true
                }
            },
            messageSystem: true,
            parentIs: {
                select: {
                    ...messageSelect,
                    creator: {
                        select: defaultUserSelect
                    }
                }
            },
            creator: {
                select: defaultUserSelect
            }
        },
        // include: {
        //     messageSystem: true,
        //     messageRecipient: {
        //         select: {
        //             recipientId: true,
        //             isRead: true
        //         }
        //     },
        // },
        take,
        skip,
        where: {
            messageRecipient: {
                some: {
                    recipientRoom: {
                        chatRoomId: roomId
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' },

    })
    return chatLog;
}
async function getChatRoomMember(chatRoomId: string) {
    const members = await prisma.userChatRoom.findMany({
        where: {
            chatRoomId: chatRoomId
        }
    })
    return members;
}
async function createRoomMessage(username: string, { messageBody, chatRoomId, parentId = null }: MessageReq) {
    const messageSelect = { id: true, createdAt: true, messageBody: true, }
    console.log({ username, messageBody, chatRoomId, parentId });

    const memberChatRooms = await prisma.userChatRoom.findMany({
        where: {
            chatRoomId: chatRoomId,
            NOT: { username }
        }
    })
    const messageRecipientList = await memberChatRooms.map((mem) => ({
        recipientId: mem.username,
        recipientRoomId: mem.id
    }))
    // console.log(messageRecipientList);
    const chatLog = await prisma.message.create({
        data: {
            creatorId: username,
            messageBody,
            parentId,
            messageRecipient: {
                createMany: { data: messageRecipientList }
            }
        }
    })
    return chatLog;

}
async function createRoomSystemMessage(username: string, type: 'call' | 'video call' | 'system', {
    messageBody, chatRoomId, parentId = null
}: { messageBody: Prisma.JsonArray, chatRoomId: string, parentId?: string | null }) {

    const messageSelect = { id: true, createdAt: true, messageBody: true, }
    console.log({ type, username, messageBody, chatRoomId, parentId });

    if (username) {
        const memberChatRooms = await prisma.userChatRoom.findMany({
            where: {
                chatRoomId: chatRoomId,
                NOT: { username }
            }
        })
        // console.log(memberChatRooms);
        const messageRecipientList = await memberChatRooms.map((mem) => ({
            recipientId: mem.username,
            recipientRoomId: mem.id
        }))
        // console.log(messageRecipientList); 
        const chatLog = await prisma.message.create({
            data: {
                creatorId: username,
                messageBody: '',
                parentId,
                messageRecipient: {
                    createMany: { data: messageRecipientList }
                },
                messageSystem: {
                    create: {
                        messageBody,
                        type,
                    }
                }
            }
        })
        return chatLog;
    }
}



export const chatService = {
    getChatLog, createRoomMessage, createRoomSystemMessage, getChatRoomMember, getChatRoomList, getChatRoom,

}