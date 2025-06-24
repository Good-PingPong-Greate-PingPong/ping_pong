import { FastifyInstance } from 'fastify';
import { authHandler } from '../handlers';
import { authSchema } from '../schema';
import { jwtUtil } from '../lib';

const schema = authSchema;

const authRoute = async (fastify: FastifyInstance): Promise<void> => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get('/login', authHandler.login);
  fastify.get(
    '/google/callback',
    { schema: schema.googleCallbackSchema },
    authHandler.googleCallback,
  );
  fastify.post(
    '/refresh',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.refresh),
      schema: schema.refreshSchema,
    },
    authHandler.refresh,
  );
  fastify.get('/logout', { schema: schema.logoutSchema }, authHandler.logout);
};

export default authRoute;
