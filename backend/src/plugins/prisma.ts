import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export default fp(async (fastify) => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected'); // fix me
  } catch (err) {
    console.error('❌ Prisma connection error:'); // fix me
    process.exit(1);
  }
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
    console.log('📴 Prisma disconnected'); // fix me
  });
});
