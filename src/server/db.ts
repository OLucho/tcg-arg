import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  const databaseUrl = process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : 'file:./dev.db';

  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma