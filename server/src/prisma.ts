import { PrismaClient, Tag } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import nanoid from 'nanoid'
const generateId = nanoid.customAlphabet('1234567890abcdefghkilmnoitvyz')
const prisma = new PrismaClient()


const activeRaw: unknown = fs.readFileSync(path.resolve(__dirname, '../tmp/tags.json'))
const dataRaw: unknown = fs.readFileSync(path.resolve(__dirname, '../tmp/tags.json'))

const active: Tag[] = JSON.parse(dataRaw as string)
console.log(active);


async function main() {
    // ... you will write your Prisma Client queries here
    // const data: Tag[] = active.map<Tag>((e) => {
    //     return {
    //         id: e.id,
    //         parentId: e.parentId || null,
    //         name: e.name,
    //         iconPath: e.iconPath || null,
    //     }
    // })

    // console.log(data);
    // const result = await prisma.tag.createMany({
    //     data: data
    // })

    // console.log(result);

    const result = await prisma.tag.findMany({
        include: {
            hasChild: true
        },
    })
    result.forEach(e => {
        if (e.hasChild.length) {
            console.log(e);
        }
    })
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