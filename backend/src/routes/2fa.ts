import { FastifyInstance } from 'fastify';
import { twoFAHandler } from '../handlers';
import { twoFASchema } from '../schema';
import { jwtUtil } from '../lib';

const schema = twoFASchema;

const twoFARoute = async (fastify: FastifyInstance): Promise<void> => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get(
    '/setup',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: schema.generate2FASchema,
    },
    twoFAHandler.setup,
  );

  fastify.post(
    '/verify',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.tmp),
      schema: schema.verify2FASchema,
    },
    twoFAHandler.verify,
  );

  fastify.post(
    '/reset/request',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.tmp),
      schema: schema.resetRequestSchema,
    },
    twoFAHandler.resetRequest,
  );

  fastify.get(
    '/reset/confirm',
    { schema: schema.resetConfirmSchema },
    twoFAHandler.resetConfirm,
  );
};

export default twoFARoute;
