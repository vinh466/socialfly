
import { Server, Socket } from "socket.io";
import chatSocketHandler from "./chat.socket";
import { instrument } from "@socket.io/admin-ui";
import { verifyAccessToken } from "@/utils/jwt.util";
import { TokenDecoded } from "@/middlewares/jwtValidate.mdw";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@/types/scoket.type";
import userService from "@/services/user.service";

export type SocketServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type SocketHandler = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>



function createSocketServer(io: SocketServer) {
    instrument(io, {
        mode: "development",
        auth: false
    });

    io.use(async function (socket, next) {
        let socketId = '[' + socket.id + ']';
        const token = socket.handshake.auth.token;
        try {
            const decoded = verifyAccessToken<TokenDecoded>(token)
            socket.username = decoded.username
            next();
        } catch (e) {
            console.log("Connection from: " + socketId + " was rejected");
            console.log("Token [" + token + "] from: " + socketId + " was rejected");
            next(new Error("unauthorized"));
        }
    })

    io.on('connection', (socket => {
        socketHandler(io, socket)
    }));
    console.info(`Sockets enabled`);
}

const socketHandler = (io: Server, socket: Socket) => {
    console.info(`User "${socket.username}" connected`);
    userService.setOnline(socket.username)
    socket.join(socket.username)
    chatSocketHandler(io, socket);

    socket.on("disconnect", (reason) => {
        socket.leave(socket.username)
        userService.setOffline(socket.username)
        console.info(`User ${socket.username} disconnected`);
    });
}

export default createSocketServer;