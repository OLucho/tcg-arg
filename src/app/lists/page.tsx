import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { prisma } from "~/server/db";
import { PageClient } from "./page-client";
import type { ApiList } from "./useLists";

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

    const transformedLists: ApiList[] = lists.map(list => ({
        ...list,
        description: list.description ?? undefined,
        createdAt: list.createdAt.toISOString(),
        updatedAt: list.updatedAt.toISOString()
    }))

    return (
        <PageClient serverLists={transformedLists} />
    )
}