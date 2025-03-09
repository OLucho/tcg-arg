import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";

export default async function ListsLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const isLoggedIn = !!session?.user
    if (!isLoggedIn) {
        redirect("/")
    }

    return <main>
        {children}
    </main>;
}