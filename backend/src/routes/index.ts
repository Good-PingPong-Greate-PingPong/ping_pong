import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import localGameRoute from './localgame';
import twoFARoute from './2fa';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(twoFARoute, { prefix: '/api/2fa' });
  fastify.register(localGameRoute, { prefix: '/api/localgame'});
};

export default routes;