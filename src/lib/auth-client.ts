import { createAuthClient } from "better-auth/react";

const isDev = process.env.ENV === "development";

const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})

export const {
    signIn, signOut, signUp
} = authClient;