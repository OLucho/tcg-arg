import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { prisma } from "~/server/db";
import { PageClient } from "./page-client";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const lists = await prisma.list.findMany({
        where: {
            userId: session?.user?.id
        },
        include: { cards: true }
    })
    console.log(lists)
    return (
        <PageClient serverLists={lists} />
    )
}