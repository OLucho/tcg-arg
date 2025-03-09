import { createAuthClient } from "better-auth/react";

const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const authClient = createAuthClient({
    baseURL: isDev ? "http://localhost:3000" : "https://tcg-arg.vercel.app/",
})

export const {
    signIn, signOut, signUp, getSession
} = authClient;