import { FastifyInstance } from 'fastify';
import userHandler from '../handlers/user.handler';
import { jwtUtil } from '../lib';

const userRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/image',
    {
      preHandler: async (req, reply) => {
        await jwtUtil.verifyAccessToken(req, reply, { expectTmpToken: false });
      },
    },
    userHandler.updateImage,
  );
};

export default userRoute;
