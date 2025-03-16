import { prisma } from "~/server/db";

export async function getListById(listId: string) {
    const list = await prisma.list.findUnique({
        where: { id: listId },
        include: {
            cards: true,
            user: true
        }
    })

    if (!list) {
        return false
    }

    return list
}