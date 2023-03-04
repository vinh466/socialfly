import { Socket, Server } from "socket.io";
import { nanoid } from "nanoid";

type Room = Record<string, { name: string }>
type RoomChatLog = Record<string, {
    message: string,
    username: string
}[]>
const rooms: Room = {};
const roomChatLog: RoomChatLog = {}

const ChatEvent = {
    Client: {
        CreateRoom: "client_chat:createRoom",
        SendRoomMessage: "client_chat:sendRoomMessage",
        JoinRoom: "client_chat:joinRoom",
        GetRoom: "client_chat:getRoom",
        LeaveRoom: "client_chat:leaveRoom",
    },
    Server: {
        Rooms: "server_chat:rooms",
        JoinedRoom: "server_chat:joinedRoom",
        RoomMessage: "server_chat:roomMessage",
    }
}


export default function chatSocketHandler(io: Server, socket: Socket) {
    socket.emit(ChatEvent.Server.Rooms, rooms);

    const createRoom = (payload: { roomName: string }) => {
        const roomId = nanoid();
        rooms[roomId] = {
            name: payload.roomName,
        };
        socket.join(roomId);
        console.log(socket.id);
        console.log(socket.id, 'had create room', rooms[roomId]);

        socket.broadcast.emit(ChatEvent.Server.Rooms, rooms);// broadcast an event saying there is a new room
        socket.emit(ChatEvent.Server.Rooms, rooms);// emit back to the room creator with all the rooms
        socket.emit('', roomId);// emit event back the room creator saying they have joined a room
    }

    const sendRoomMessage =
        (payload: {
            roomId: string,
            message: string,
            username: string
        }) => {
            console.log(payload);
            const date = new Date();
            socket.to(payload.roomId).emit(ChatEvent.Server.RoomMessage, {
                message: payload.message,
                username: payload.username,
                time: `${date.getHours()}:${date.getMinutes()}`,
            });
        }
    const getRoom = () => {
        socket.emit(ChatEvent.Server.Rooms, rooms);
    }
    const joinRoom = (payload: { roomId: string }) => {
        socket.join(payload.roomId)
        socket.emit(ChatEvent.Server.JoinedRoom, payload.roomId);
        console.log(socket.id, 'had join to', payload.roomId);
        const date = new Date();
        socket.to(payload.roomId).emit(ChatEvent.Server.RoomMessage, {
            message: (socket.id + ' had join to ' + payload.roomId),
            username: "Hệ thống",
            time: `${date.getHours()}:${date.getMinutes()}`,
        });
    }

    const leaveRoom = (payload: { roomId: string }) => {
        socket.emit(ChatEvent.Client.LeaveRoom, payload.roomId);
        const date = new Date();
        socket.to(payload.roomId).emit(ChatEvent.Server.RoomMessage, {
            message: (socket.id + ' had leave to ' + payload.roomId),
            username: "Hệ thống",
            time: `${date.getHours()}:${date.getMinutes()}`,
        });
    }

    /**
     * Listener
     */
    socket.on(ChatEvent.Client.CreateRoom, createRoom); // When a user creates a new room
    socket.on(ChatEvent.Client.SendRoomMessage, sendRoomMessage); // When a user sends a room message
    socket.on(ChatEvent.Client.JoinRoom, joinRoom); // When a user joins a room
    socket.on(ChatEvent.Client.GetRoom, getRoom); // When a user joins a room
    socket.on(ChatEvent.Client.LeaveRoom, leaveRoom); // When a user leaves a room
}