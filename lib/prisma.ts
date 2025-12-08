import { PrismaClient } from "@prisma/client/extension";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

// Em ambiente de desenvolvimento, usamos a variável global para evitar múltiplas instâncias
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;