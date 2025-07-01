import { FastifyInstance } from 'fastify';
import { friendsHandler } from '../handlers';
import { jwtUtil } from '../lib';
import {
  getFriendsListSchema,
  addFriendSchema,
  removeFriendSchema,
} from '../schema/friends/friends.schema';

const friendRoute = async (fastify: FastifyInstance) => {
  const tokenType = jwtUtil.tokenTypes;

  fastify.get('/friends', {
    preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    schema: getFriendsListSchema,
    handler: friendsHandler.getFriendsList,
  });

  fastify.post('/friends', {
    preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    schema: addFriendSchema,
    handler: friendsHandler.addFriend,
  });

  fastify.delete('/friends', {
    preHandler: jwtUtil.verifyTokenPreHandler(tokenType.access),
    schema: removeFriendSchema,
    handler: friendsHandler.removeFriend,
  });
};

export default friendRoute;
