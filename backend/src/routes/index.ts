import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import localGameRoute from './localgame';
import twoFARoute from './2fa';
import userRoute from './user';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(twoFARoute, { prefix: '/api/2fa' });
  fastify.register(userRoute, { prefix: '/api/users' });
  fastify.register(localGameRoute, { prefix: '/api/localgame' });
};

export default routes;
