import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

class UserService {
    userOnline = {} as {
        [key: string]: {
            lastSeen: Date | undefined
        } | undefined
    }
    constructor() {
        this.updateUserOnline();
    }

    async updateUserOnline() {
        const users = await prisma.user.findMany({ select: { username: true, createdAt: true } })
        users.forEach((user, index) => {
            this.setOffline(user.username, user.createdAt)
        })
    }
    setOnline(username: string) {
        this.userOnline[username] = { lastSeen: undefined }
    }
    setOffline(username: string, lastSeen?: Date) {
        this.userOnline[username] = { lastSeen: new Date() }
    }
    checkOnline(username: string) {
        const user = this.userOnline[username]
        if (user && !user.lastSeen) {
            return true
        }
        return false
    }
}
const userService = new UserService()

export default userService

