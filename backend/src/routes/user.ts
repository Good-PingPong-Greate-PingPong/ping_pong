import { FastifyInstance } from 'fastify';
import { userHandler } from '../handlers';
import { jwtUtil } from '../lib';
import {
  updateUserProfileSchema,
  getUserProfileSchema,
  getUsersProfileSchema,
} from '../schema';

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
  fastify.get(
    '/info/list',
    {
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
      schema: getUsersProfileSchema,
    },
    userHandler.getUsersProfileInfo,
  );
};

export default userRoute;
