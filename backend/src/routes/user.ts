import { FastifyInstance } from 'fastify';
import profileHandler from '../handlers/profile.handler';
import { jwtUtil } from '../lib';

const profileRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/image',
    {
      preHandler: async (req, reply) => {
        await jwtUtil.verifyAccessToken(req, reply, { expectTmpToken: false });
      },
    },
    profileHandler.updateImage,
  );
};

export default profileRoute;
