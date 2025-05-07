import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import twoFARoute from './2fa';
import uploadRoute from './upload';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(twoFARoute, { prefix: '/api/2fa' });
  fastify.register(uploadRoute, { prefix: '/api/upload' });
};

export default routes;
