import { FastifyInstance } from 'fastify';
import { websocketHandler } from '../handlers';

const websocketRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/ws', { websocket: true }, websocketHandler.userSocketConnect);
  fastify.get(
    '/ws/tournament',
    { websocket: true },
    websocketHandler.tournamentSocketConnect,
  );
};

export default websocketRoute;
