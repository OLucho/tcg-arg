import { createAuthClient } from "better-auth/react";

const isDev = process.env.NEXT_PUBLIC_ENV === "development";
const authClient = createAuthClient({
    baseURL: isDev ? "http://localhost:3000" : "https://api.tcg-arg.com",
})

export const {
    signIn, signOut, signUp, getSession
} = authClient;