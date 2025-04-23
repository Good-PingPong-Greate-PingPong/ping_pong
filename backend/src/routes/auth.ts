import { FastifyInstance } from 'fastify';
import * as handler from '../handlers/auth.handler';
import { loginSchema, refreshSchema, logoutSchema } from '../schema';

const authRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/login', handler.loginRedirectHandler);
  fastify.get('/google/callback', handler.googleCallbackHandler);
  fastify.post('/refresh', { schema: refreshSchema }, handler.refreshHandler);
  fastify.get('/logout', { schema: logoutSchema }, handler.logoutHandler);
};

export default authRoute;
