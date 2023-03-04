export const ChatEvent = {
    Client: {
        CreateRoom: "client_chat:createRoom",
        SendRoomMessage: "client_chat:sendRoomMessage",
        GetRoom: "client_chat:getRoom",
        JoinRoom: "client_chat:joinRoom",
        LeaveRoom: "client_chat:leaveRoom",
    },
    Server: {
        Rooms: "server_chat:rooms",
        JoinedRoom: "server_chat:joinedRoom",
        RoomMessage: "server_chat:roomMessage",
    }
}