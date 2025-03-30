import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { logger } from '../lib';

export const prisma = new PrismaClient();

export default fp(async (fastify) => {
  try {
    await prisma.$connect();
    logger.log('✅ Prisma connected');
  } catch (err) {
    logger.error('❌ Prisma connection error:');
    process.exit(1);
  }
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
    logger.log('📴 Prisma disconnected');
  });
});
