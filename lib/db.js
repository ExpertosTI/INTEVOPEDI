import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const globalForPrisma = globalThis;

let prismaInstance = globalForPrisma.prisma;
let prismaInitError = null;

if (!prismaInstance) {
  try {
    const { PrismaClient } = require('@prisma/client');
    prismaInstance = new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    prismaInitError = error;
  }
}

export const prisma = prismaInstance || new Proxy(
  {},
  {
    get() {
      throw prismaInitError || new Error('Prisma client is not available. Run prisma generate before using database features.');
    }
  }
);

export function getPrismaInitError() {
  return prismaInitError;
}
