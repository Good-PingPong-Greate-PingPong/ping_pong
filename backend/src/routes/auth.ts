import { FastifyInstance } from 'fastify';
import { authHandler } from '../handlers';
import { loginSchema, refreshSchema, logoutSchema } from '../schema';
import { jwtUtil } from '../lib';

const authRoute = async (fastify: FastifyInstance): Promise<void> => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get('/login', { schema: loginSchema }, authHandler.login);
  fastify.get('/google/callback', authHandler.googleCallback);
  fastify.post(
    '/refresh',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.refresh),
      schema: refreshSchema,
    },
    authHandler.refresh,
  );
  fastify.get('/logout', { schema: logoutSchema }, authHandler.logout);
};

export default authRoute;
