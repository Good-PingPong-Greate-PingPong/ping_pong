import { FastifyInstance } from 'fastify';
import { jwtUtil } from '../lib';
import { localGameHandler } from '../handlers/index';
import { createLocalGameSchema, readLocalGameSchema } from '../schema';
import { CreateLocalGameRoute, ListQueryRoute } from '../schema/type/index';

const localGameRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;
  fastify.post<CreateLocalGameRoute>(
    '/create',
    {
      schema: createLocalGameSchema,
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    },
    localGameHandler.createLocalGame,
  );

  fastify.get<ListQueryRoute>(
    '/results',
    {
      schema: readLocalGameSchema,
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    },
    localGameHandler.readLocalGame,
  );
};

export default localGameRoute;
