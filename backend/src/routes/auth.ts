import { FastifyInstance } from 'fastify';
import { authHandler } from '../handlers';
import { loginSchema, refreshSchema, logoutSchema } from '../schema';

const authRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/login', authHandler.login);
  fastify.get('/google/callback', authHandler.googleCallback);
  fastify.post('/refresh', { schema: refreshSchema }, authHandler.refresh);
  fastify.get('/logout', { schema: logoutSchema }, authHandler.logout);
};

export default authRoute;
