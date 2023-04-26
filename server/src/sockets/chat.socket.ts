import { Socket, Server } from "socket.io";
import { nanoid } from "nanoid";
import { SocketHandler, SocketServer } from ".";
import { ChatLog, Room, RoomChatLog } from "@/types/chat.type";
import { chatService } from "@/services/chat.service";
import { ClientCallResponse, MessageFromPeer, MessageToPeer, Participant, PeerMessage } from "@/types/chatRTC.type";
import { uuid as uuidv4 } from 'uuidv4'
import userService from "@/services/user.service";
// const rooms: Room = {};
// const roomChatLog: RoomChatLog = {}

const startedCallRoom = {} as {
    [key: string]: {
        type: 'video call' | 'call'
        creator: string
        startedAt: number
    } | undefined
}

const callRooms = {} as {
    [key: string]: Array<Participant> | undefined
}
const callWaitting = {} as {
    [key: string]: NodeJS.Timeout | undefined
}
export default function chatSocketHandler(io: SocketServer, socket: SocketHandler) {
    /**
    * Listener
    */
    socket.on('chatClient_getRoom', async ({ body }) => {
        if (body) {
            const { chatRoomId } = body
            try {
                const chatRoom = await chatService.getChatRoom(chatRoomId);
                socket.emit('chatServer_sendRoom', { data: chatRoom });
            } catch (error) {
                console.log(error);
            }
        } else {
            socket.emit('chatServer_sendRoom', {
                data: null, meta: { msg: 'roomId not provided' }
            });
        }
    });

    socket.on('chatClient_getRoomList', async () => {
        try {
            const chatRoomList = await chatService.getChatRoomList(socket.username);
            socket.emit('chatServer_sendRoomList', { data: chatRoomList });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('chatClient_getChatLog', async ({ body }) => {
        if (body) {
            const { chatRoomId } = body
            try {
                // socket.emit(roomId, () => { })
                const chatLog = await chatService.getChatLog(chatRoomId);
                socket.emit('chatServer_sendChatLog', { data: chatLog, meta: { chatRoomId: chatRoomId } });
            } catch (error) {
                console.log(error);
            }
        } else {
            socket.emit('chatServer_sendChatLog', {
                data: null, meta: { msg: 'roomId not provided' }
            });
        }
    });

    socket.on('chatClient_sendRoomMessage', async ({ body }, cb) => {
        if (body) {
            const { messageBody, chatRoomId } = body
            try {
                const roomMember = await chatService.getChatRoomMember(chatRoomId)
                const roomIdList = roomMember?.map((mem) => {
                    return mem.username
                })
                const addMessage = await chatService.createRoomMessage(socket.username, body)
                if (roomIdList) {
                    const chatLog = await chatService.getChatLog(chatRoomId);
                    io.to(roomIdList).emit('chatServer_newMessage', { data: { chatRoomId, message: addMessage } })
                }
                cb({ status: 'ok' })
                return;
            } catch (error) {
                console.log(error);
            }
        } else {
            socket.emit('chatServer_sendChatLog', {
                data: null, meta: { msg: 'message invalid' }
            });
        }
        cb({ status: 'error' })
    });
    const sendHasJoinRes = (chatRoomId: string, peerId: string) => {
        io.to(chatRoomId).emit("chatServer_callResponse", {
            data: { chatRoomId, peerId, type: 'has join' },
            meta: { participants: callRooms[chatRoomId] as Participant[] },
        });
    }
    const sendHasLeftRes = (chatRoomId: string, peerId: string) => {
        socket.to(chatRoomId).emit("chatServer_callResponse", {
            data: { chatRoomId, peerId, type: 'has left' },
            meta: { participants: callRooms[chatRoomId] as Participant[] },
        });
    }
    const sendHasEndRes = (chatRoomId: string, peerId: string) => {
        socket.to(chatRoomId).emit("chatServer_callResponse", {
            data: { chatRoomId, peerId, type: 'has end' },
            meta: { participants: callRooms[chatRoomId] as Participant[] },
        });
    }
    const createCallRoom = ({ chatRoomId, peerId, userIdList }: PeerMessage) => {
        callRooms[chatRoomId] = []
        userIdList?.forEach((userId) => {
            callRooms[chatRoomId]?.push({
                peerId: userId,
                status: 'watting'
            })
        })
        joinCallRoom({ chatRoomId, peerId })
    };
    const joinCallRoom = ({ chatRoomId, peerId, userIdList, type = 'call' }: PeerMessage) => {
        const callRoom = callRooms[chatRoomId]
        if (callRoom) {
            let connectedCount = 0
            callRoom.forEach((participant, index) => {
                if (participant.peerId === peerId) participant.status = 'connect'
                if (participant.status === 'connect') connectedCount++
            })
            socket.join(chatRoomId);
            sendHasJoinRes(chatRoomId, peerId)
            if (!startedCallRoom[chatRoomId]) {
                startedCallRoom[chatRoomId] = {
                    type,
                    creator: peerId,
                    startedAt: 0
                }
            } else if (connectedCount === 2) {
                console.log('The call ', chatRoomId, 'is start.');
                startedCallRoom[chatRoomId] = {
                    type,
                    creator: startedCallRoom[chatRoomId]?.creator as string,
                    startedAt: new Date().getTime()
                }
            }
        } else {
            createCallRoom({ chatRoomId, peerId, userIdList });
        }
    };
    const endCallRoom = async (chatRoomId: string, peerId: string,) => {
        const started = startedCallRoom[chatRoomId]
        if (started) {
            const time = started.startedAt == 0 ? 0 : new Date((new Date()).getTime() - started.startedAt).getSeconds()
            console.log('The ', chatRoomId, '\'s call lasted for', time, 'seconds');
            sendHasEndRes(chatRoomId, peerId)
            startedCallRoom[chatRoomId] = undefined
            callRooms[chatRoomId] = undefined
            const addMessage = await chatService.createRoomSystemMessage(started.creator,
                started.type || 'video call', {
                chatRoomId,
                messageBody: [{ time, createdAt: '' }],
            })
            if (addMessage) {
                const roomMember = await chatService.getChatRoomMember(chatRoomId)
                const roomIdList = roomMember?.map((mem) => {
                    return mem.username
                })
                io.to(roomIdList).emit('chatServer_newMessage', { data: { chatRoomId, message: addMessage } })
            }
        }
    }
    const connectCallRoom = ({ chatRoomId, peerId }: PeerMessage) => {
        joinCallRoom({ chatRoomId, peerId })
        callRooms[chatRoomId]?.forEach((participant, index) => {
            if (participant.peerId === peerId) participant.status = 'connect'
        })
    };
    const cancelCallRoom = ({ chatRoomId, peerId }: PeerMessage) => {
        let connectedCount = 0
        callRooms[chatRoomId]?.forEach((participant, index) => {
            if (participant.peerId === peerId) participant.status = 'cancel'
            if (participant.status === 'connect') connectedCount++
        })
        socket.leave(chatRoomId)
        sendHasLeftRes(chatRoomId, peerId)
        if (connectedCount <= 1) {
            endCallRoom(chatRoomId, peerId)
        }
    };
    const denyCallRoom = ({ chatRoomId, peerId }: PeerMessage) => {
        let connectedCount = 0
        let waittingCount = 0
        callRooms[chatRoomId]?.forEach((participant, index) => {
            if (participant.peerId === peerId) participant.status = 'deny'
            connectedCount += participant.status === 'connect' ? 1 : 0
            waittingCount += participant.status === 'watting' ? 1 : 0
        })
        if (connectedCount <= 1 && !waittingCount) {
            endCallRoom(chatRoomId, peerId,)
        }
    };
    const cannotCallRoom = ({ chatRoomId, peerId }: PeerMessage) => {
        let connectedCount = 0
        let waittingCount = 0
        callRooms[chatRoomId]?.forEach((participant, index) => {
            if (participant.peerId === peerId) participant.status = 'cannot'
            connectedCount += participant.status === 'connect' ? 1 : 0
            waittingCount += participant.status === 'watting' ? 1 : 0
        })
        if (connectedCount <= 1 && !waittingCount) {
            endCallRoom(chatRoomId, peerId,)
        }
    };
    const handleCallRequest = async ({ chatRoomId, peerId, type }: MessageToPeer) => {
        console.log(`[${peerId}] chatClient_callRequest`, { chatRoomId, peerId, type });
        const roomMember = await chatService.getChatRoomMember(chatRoomId)
        const callList = roomMember.reduce<Array<string>>((res, curr, index) => {
            if (curr.username !== socket.username)
                res.push(curr.username)
            return res
        }, [])
        const userIdList = roomMember?.map((mem) => {
            return mem.username
        })
        joinCallRoom({ chatRoomId, peerId, userIdList, type })
        if (callList) {
            const chatRoom = await chatService.getChatRoom(chatRoomId);

            callList.forEach(async (username, index, list) => {
                if (userService.checkOnline(username)) {
                    callWaitting[username] = setTimeout(() => {
                        callWaitting[username] = undefined
                        cannotCallRoom({ chatRoomId, peerId: username, })
                        io.to([chatRoomId, username]).emit('chatServer_callResponse', {
                            data: { chatRoomId: chatRoomId, peerId: username, type: 'time out' },
                            meta: { message: "time out" }
                        })
                    }, 10000)

                    io.to(username).emit('chatServer_callRequest', {
                        data: {
                            chatRoomId,
                            roomInfo: chatRoom,
                            participants: callRooms[chatRoomId] as Participant[],
                            type
                        }
                    })
                } else {
                    // const addMessage = await chatService.createRoomSystemMessage(username,
                    //     'system', {
                    //     chatRoomId,
                    //     messageBody: [{ message: 'Hiện không online' }],
                    // })

                    cannotCallRoom({ chatRoomId, peerId: username, })
                    io.to(chatRoomId).emit('chatServer_callResponse', {
                        data: { chatRoomId: chatRoomId, peerId: username, type: 'no online' },
                        meta: { message: "user not online" }
                    })
                }
            })

        }
    }
    socket.on("chatClient_callRequest", async ({ body }) => {
        if (body) handleCallRequest(body)
    })
    socket.on("chatClient_callResponse", async ({ body },) => {
        if (body) {
            console.log('chatClient_callResponse', body);
            const { chatRoomId, type, peerId } = body
            if (['cancel', 'accept', 'deny'].includes(type)) {
                // io.to(chatRoomId).emit('chatServer_callResponse', {
                //     data: { chatRoomId: chatRoomId, peerId, type },
                // })
                if (type === 'accept') {
                    if (callWaitting[peerId]) {
                        connectCallRoom({ chatRoomId, peerId })
                        clearTimeout(callWaitting[peerId])
                        callWaitting[peerId] = undefined
                    }
                }
                if (type === 'cancel') {
                    cancelCallRoom({ chatRoomId, peerId })
                }
                if (type === 'deny') {
                    denyCallRoom({ chatRoomId, peerId })
                }
                // if (type === 'deny') joinCallRoom(body)
            } else {
                io.to(chatRoomId).emit('chatServer_callResponse', {
                    data: { chatRoomId: chatRoomId, peerId, type: 'cannot' },
                })
            }
        }
    })
}