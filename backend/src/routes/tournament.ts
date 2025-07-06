import { FastifyInstance } from 'fastify';
import { jwtUtil } from '../lib';
import { readTournamentSchema } from '../schema';
import { ListQueryRoute } from '../schema/type/index';
import { tournamentHandler } from '../handlers/index';

const tournamentRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get<ListQueryRoute>(
    '/results',
    {
      schema: readTournamentSchema,
      preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    },
    tournamentHandler.readTournament,
  );
};

export default tournamentRoute;
