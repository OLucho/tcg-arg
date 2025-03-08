import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URL
  : 'file:./dev.db';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

prisma.$connect().then(() => {
  console.log(`Conectado a la base de datos en ${process.env.NODE_ENV}`);
}).catch((error) => {
  console.error('Error al conectar a la base de datos:', error);
});
