import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import twoFARoute from './2fa';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(twoFARoute, { prefix: '/api/2fa' });
};

export default routes;
