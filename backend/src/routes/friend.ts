import { FastifyInstance } from 'fastify';
import { friendHandler } from '../handlers';
import { jwtUtil } from '../lib';
import {
  getfriendListSchema,
  addfriendchema,
  removefriendchema,
} from '../schema/friend/friend.schema';

const friendRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get('/friend', {
    preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    schema: getfriendListSchema,
    handler: friendHandler.getfriendList,
  });

  fastify.post('/friend', {
    preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    schema: addfriendchema,
    handler: friendHandler.addFriend,
  });

  fastify.delete('/friend', {
    preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    schema: removefriendchema,
    handler: friendHandler.removeFriend,
  });
};

export default friendRoute;
