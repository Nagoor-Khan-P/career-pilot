import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const getPrismaClient = (): PrismaClient => {
  if (globalThis.prisma) {
    return globalThis.prisma;
  }

  const newPrismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = newPrismaClient;
  }

  return newPrismaClient;
};

// Lazy-loaded singleton using getter
export const prisma = new Proxy<PrismaClient>({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrismaClient();
    return (client as any)[prop];
  },
});
