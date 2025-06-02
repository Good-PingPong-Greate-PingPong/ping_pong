import { FastifyInstance } from 'fastify';
import { jwtUtil } from '../lib';
import { localGameHandler } from '../handlers';
import { createLocalGameSchema, readLocalGameSchema, listQuerySchema } from '../schema';

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

  fastify.get<{Querystring: listQuerySchema}>(
    '/results',
    {
      schema: readLocalGameSchema,
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access)
    },
    localGameHandler.readLocalGame
  );
};

export default localGameRoute;