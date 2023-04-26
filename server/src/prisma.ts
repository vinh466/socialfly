import { PrismaClient, Tag } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import nanoid from 'nanoid'
import { generateSentence, getRandomElement } from './utils/helper.util'
const generateId = nanoid.customAlphabet('1234567890abcdefghkilmnoitvyz')
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], })


// const activeRaw: unknown = fs.readFileSync(path.resolve(__dirname, '../tmp/tags.json'))
// const dataRaw: unknown = fs.readFileSync(path.resolve(__dirname, '../tmp/tags.json'))

// const active: Tag[] = JSON.parse(dataRaw as string)
// console.log(active);


async function main() {
    const userList = ['vinh', 'vinh2', 'vinh3']
    const messageIdList = [
        'cleyt216a0000t5u8gj26u3qf',
        'cleyt216b0001t5u8p9isnf1f',
        'cleyt216b0002t5u8izxv9q8k',
        'cleyt216b0004t5u87wsfiirr',
        'cleyt216b0005t5u8oe5s346k',
        'cleyt39mi0000t5i03vts8v4v',
        'cleyt39mi0001t5i0xozrop0a',
        'cleyt39mi0002t5i0e3wfmxyf',
        'cleyt39mi0003t5i0czlzegfy',
        'cleyt39mi0004t5i0gn5k5t5i',
        'cleyt39mi0005t5i09zhz1fmd',
        'cleytfhaq0000t58g7rdl7gso',
        'cleytfhaq0001t58gk03honrt',
        'cleytfhaq0002t58g4jjg29fw',
        'cleytfhaq0003t58g1ozzcs0o',
        'cleytfhaq0004t58g35252nni',
        'cleytfhaq0005t58giwm7pmom',
    ]
    try {
        // const createChatRoom = await prisma.messageRecipient.createMany({
        //     data: [
        //         {
        //             messageId: 'cleyt216b0004t5u87wsfiirr',
        //             recipientId: 'vinh',
        //             recipientRoomId: 'clexbpodn0001t550nq9hi423'
        //         }, {
        //             messageId: 'cleyt39mi0000t5i03vts8v4v',
        //             recipientId: 'vinh',
        //             recipientRoomId: 'clexbpodn0001t550nq9hi423'
        //         }, {
        //             messageId: 'cleyt39mi0003t5i0czlzegfy',
        //             recipientId: 'vinh2',
        //             recipientRoomId: 'clexbpodn0002t550ss3qt8a8'
        //         }, {
        //             messageId: 'cleyt39mi0002t5i0e3wfmxyf',
        //             recipientId: 'vinh2',
        //             recipientRoomId: 'clexbpodn0002t550ss3qt8a8'
        //         }, {
        //             messageId: 'cleyt39mi0005t5i09zhz1fmd',
        //             recipientId: 'vinh',
        //             recipientRoomId: 'clexbpodn0001t550nq9hi423'
        //         }
        //     ]
        // })
        // console.log(createChatRoom);
    } catch (error) {
        console.log(error);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })