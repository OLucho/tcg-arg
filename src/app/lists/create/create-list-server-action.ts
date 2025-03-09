/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use server"

import { prisma } from "~/server/db";


export async function createListServerAction(data: { name: string; description?: string; isPublic: boolean; userId: string }) {
    return await prisma.list.create({
        data: {
            name: data.name,
            description: data.description,
            isPublic: data.isPublic,
            userId: data.userId,
            id: crypto.randomUUID()
        }
    })
}