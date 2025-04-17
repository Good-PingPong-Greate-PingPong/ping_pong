import { FastifyInstance } from 'fastify';
import * as handler from '../handlers/auth.handler';

const authRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/login', async (req, reply) => {
    reply.redirect('/auth/google');
  });
  fastify.get('/google/callback', handler.googleCallbackHandler);
  fastify.post('/refresh', handler.refreshHandler);
  fastify.get('/logout', handler.logoutHandler);
};

export default authRoute;
