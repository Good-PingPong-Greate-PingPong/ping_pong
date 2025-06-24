import { FastifyInstance } from 'fastify';
import { userHandler } from '../handlers';
import { jwtUtil } from '../lib';
import { getUserProfileSchema, updateUserProfileSchema } from '../schema';

const userRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;
  fastify.post(
    '/info',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: updateUserProfileSchema,
    },
    userHandler.uploadProfileInfo,
  );
  fastify.get(
    '/info',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: getUserProfileSchema,
    },
    userHandler.getProfileInfo,
  );
};

export default userRoute;
