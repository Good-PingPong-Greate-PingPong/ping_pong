import { FastifyInstance } from 'fastify';
import authRoute from './auth';
import localGameRoute from './localgame';
import twoFARoute from './2fa';
import userRoute from './user';
import websocketRoute from './websocket';
import friendRoute from './friend';

const routes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.register(authRoute, { prefix: '/api/auth' });
  fastify.register(twoFARoute, { prefix: '/api/2fa' });
  fastify.register(userRoute, { prefix: '/api/users' });
  fastify.register(localGameRoute, { prefix: '/api/localgame' });
  fastify.register(friendRoute, { prefix: '/api/friend' });
  fastify.register(websocketRoute);
};

export default routes;
