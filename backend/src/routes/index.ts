import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import localGameRoute from './localgame';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(localGameRoute, { prefix: '/api/localgame'})
};

export default routes;