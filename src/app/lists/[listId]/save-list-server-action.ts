"use server";
import { prisma } from "~/server/db";
export async function addCardsToList(listId: string, cardIds: string[]) {
    await prisma.list.update({
        where: { id: listId },
        data: {
            cards: {
                connect: cardIds.map((cardId) => ({ id: cardId }))
            }
        }
    });

    return { success: true };
}
