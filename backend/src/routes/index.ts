import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import localGameRoute from './local.game';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(localgameRoute, { prefix: '/api/localgame'})
};

export default routes;