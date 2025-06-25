import { FastifyInstance } from 'fastify';
import { userHandler } from '../handlers';
import { jwtUtil } from '../lib';
import { userSchema } from '../schema';

const schema = userSchema;

const userRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;
  fastify.post(
    '/info',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: schema.updateUserProfileSchema,
    },
    userHandler.uploadProfileInfo,
  );
  fastify.get(
    '/info',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: schema.getUserProfileSchema,
    },
    userHandler.getProfileInfo,
  );
  fastify.get(
    '/info/list',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: schema.getUsersProfileSchema,
    },
    userHandler.getUsersProfileInfo,
  );
};

export default userRoute;
