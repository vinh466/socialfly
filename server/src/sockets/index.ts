
import { Server, Socket } from "socket.io";
import chatSocketHandler from "./chat.socket";
import { instrument } from "@socket.io/admin-ui";
import { verifyAccessToken } from "@/utils/jwt.util";
function createSocketServer(io: Server) {
    instrument(io, {
        mode: "development",
        auth: false
    });
    io.use(async function (socket, next) {
        let socketId = '[' + socket.id + ']';
        console.log("address " + socketId);
        const token = socket.handshake.auth.token;
        if (token !== undefined) {
            try {
                const decoded = verifyAccessToken(token)
                const serverTimestamp = Math.floor(Date.now() / 1000);
                const clientTimestamp = decoded.exp;

                if (clientTimestamp && clientTimestamp > serverTimestamp) {
                    console.log("Connection from: " + socketId + " was accepted");
                    console.log("Token [" + token + "] from: " + socketId + " was accepted");
                    next();
                }
            } catch (e) {
                console.log("Connection from: " + socketId + " was rejected");
                console.log("Token [" + token + "] from: " + socketId + " was rejected");
                next(new Error("unauthorized"));
            }

        } else {
            console.log("Connection from: " + socketId + " was rejected");
            next(new Error("unauthorized"));
        }
    })
    io.on('connection', (socket => socketHandler(io, socket)));
    console.info(`Sockets enabled`);
}
const socketHandler = (io: Server, socket: Socket) => {
    console.info(`User "${socket.id}" connected`);


    chatSocketHandler(io, socket);

    socket.on("disconnect", (reason) => {
        console.info(`User ${socket.id} disconnected`);
    });
}

export default createSocketServer;