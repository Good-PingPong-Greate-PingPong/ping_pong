import { FastifyInstance } from 'fastify';
import { jwtUtil } from '../lib';
import { createLocalGameSchema } from '../schema';
import localGameHandler from '../handlers/localgame.handler';

const localGameRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;
  fastify.post(
    '/create',
    {
      schema: createLocalGameSchema,
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    },
    localGameHandler.createLocalGame,
  );
};

export default localGameRoute;
