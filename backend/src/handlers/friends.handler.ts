import { FastifyRequest, FastifyReply } from 'fastify';
import { friendsService } from '../services';
import { ERROR_MESSAGE, handlerUtil, SUCCESS_MESSAGE } from '../lib';
import { GetFriendsListRoute, ModifyFriendRoute } from '../schema/type';

const friendsHandler = () => {
  //친구 목록 조회
  const getFriendsList = async (
    req: FastifyRequest<GetFriendsListRoute>,
    reply: FastifyReply,
  ) => {
    try {
      const userId = req.user.userId;
      const { page = 1 } = req.query as {
        page?: number;
      };

      const data = await friendsService.getFriendsList(userId, page, 10);

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.getFriendsList, {
        data,
      });
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, err);
    }
  };

  //친구 추가
  const addFriend = async (
    req: FastifyRequest<ModifyFriendRoute>,
    reply: FastifyReply,
  ) => {
    try {
      const senderId = req.user.userId;
      const { receiverId } = req.body;

      await friendsService.addFriend(senderId, receiverId);

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.addFriend);
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, err);
    }
  };

  //친구 삭제
  const removeFriend = async (
    req: FastifyRequest<ModifyFriendRoute>,
    reply: FastifyReply,
  ) => {
    try {
      const senderId = req.user.userId;
      const { receiverId } = req.body;

      await friendsService.removeFriend(senderId, receiverId);

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.cancelFriend);
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, err);
    }
  };

  return {
    getFriendsList,
    addFriend,
    removeFriend,
  };
};

export default friendsHandler();
