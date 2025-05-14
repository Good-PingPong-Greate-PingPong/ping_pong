import { FastifyInstance } from 'fastify';
import twoFAHandler from '../handlers/2fa.handler';
import {
  generate2FASchema,
  verify2FASchema,
  resetRequestSchema,
  resetConfirmSchema,
} from '../schema';
import { jwtUtil } from '../lib';

const twoFARoute = async (fastify: FastifyInstance): Promise<void> => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get(
    '/setup',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: generate2FASchema,
    },
    twoFAHandler.setup,
  );

  fastify.post(
    '/verify',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.tmp),
      schema: verify2FASchema,
    },
    twoFAHandler.verify,
  );

  fastify.post(
    '/reset/request',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.tmp),
      schema: resetRequestSchema,
    },
    twoFAHandler.resetRequest,
  );

  fastify.get(
    '/reset/confirm',
    { schema: resetConfirmSchema },
    twoFAHandler.resetConfirm,
  );
};

export default twoFARoute;
