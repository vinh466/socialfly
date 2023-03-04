import { Prisma, PrismaClient } from "@prisma/client";
import envVars from "./declarations/config/envVars";
import expressServer from "./server";
import createSocketServer from "./sockets";

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(expressServer)
const db = new PrismaClient()


const run = async () => {
    try {
        await db.$connect();
        console.log('Prisma is connected');

        createSocketServer(new Server(httpServer, {
            cors: {
                origin: ["https://admin.socket.io", "http://127.0.0.1:5173"],
                credentials: true
            }
        }))

        httpServer.listen(envVars.port, () => {
            console.log('Server started on http://localhost:' + envVars.port + "\n");
        });
    } catch (err) {
        console.log(err);
    }
}
run();
export { db }