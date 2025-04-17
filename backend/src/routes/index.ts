import { FastifyInstance } from 'fastify';
import authRoute from './auth';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/auth' });
};

export default routes;
