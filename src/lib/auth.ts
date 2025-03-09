import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~/server/db";

const isDev = process.env.ENV === "development";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: isDev ? "sqlite" : "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
});
