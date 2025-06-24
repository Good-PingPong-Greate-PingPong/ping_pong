import { FastifyInstance } from 'fastify';
import { jwtUtil } from '../lib';
import { localGameSchema } from '../schema';
import localGameHandler from '../handlers/localgame.handler';

const schema = localGameSchema;

const localGameRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;
  fastify.post(
    '/create',
    {
      schema: schema.createLocalGameSchema,
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    },
    localGameHandler.createLocalGame,
  );
};

export default localGameRoute;
