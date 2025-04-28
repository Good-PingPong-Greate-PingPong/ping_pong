import { FastifyInstance } from 'fastify';
import twoFAHandler from '../handlers/2fa.handler';
import { generate2FASchema, verify2FASchema } from '../schema/2fa.schema';
import { jwtUtil } from '../lib';
const twoFARoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/setup',
    {
      preHandler: [jwtUtil.verifyAccessToken],
      schema: generate2FASchema,
    },
    twoFAHandler.setup,
  );

  fastify.post(
    '/verify',
    {
      preHandler: [jwtUtil.verifyAccessToken],
      schema: verify2FASchema,
    },
    twoFAHandler.verify,
  );
};

export default twoFARoute;
