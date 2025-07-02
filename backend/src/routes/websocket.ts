import { FastifyInstance } from 'fastify';
import { websocketHandler } from '../handlers';

const websocketRoute = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/ws', { websocket: true }, websocketHandler.userSocketConnect);
};

export default websocketRoute;
