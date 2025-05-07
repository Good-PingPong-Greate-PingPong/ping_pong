import { FastifyInstance } from 'fastify';
import uploadHandler from '../handlers/upload.handler';
import { jwtUtil } from '../lib';

const uploadRoute = async (fastify: FastifyInstance) => {
  fastify.post(
    '/profile',
    {
      preHandler: async (req, reply) => {
        await jwtUtil.verifyAccessToken(req, reply, { expectTmpToken: false });
      },
    },
    uploadHandler.uploadProfileImage,
  );
};

export default uploadRoute;
