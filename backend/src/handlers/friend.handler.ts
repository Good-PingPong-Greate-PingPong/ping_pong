import { FastifyRequest, FastifyReply } from 'fastify';
import { friendService } from '../services';
import { ERROR_MESSAGE, handlerUtil, SUCCESS_MESSAGE } from '../lib';
import {
  addFriendRoute,
  GetfriendListRoute,
  removeFriendRoute,
} from '../schema/type';

const friendHandler = () => {
  //친구 목록 조회
  const getFriendList = async (
    req: FastifyRequest<GetfriendListRoute>,
    reply: FastifyReply,
  ) => {
    try {
      const userId = req.user.userId;
      const { page = 1 } = req.query as {
        page?: number;
      };

      const data = await friendService.getFriendList(userId, page, 10);

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.getFriendList, {
        data,
      });
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, err);
    }
  };

  //친구 추가
  const addFriend = async (
    req: FastifyRequest<addFriendRoute>,
    reply: FastifyReply,
  ) => {
    try {
      const senderId = req.user.userId;
      const { nickname } = req.query;

      await friendService.addFriend(senderId, nickname);

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.addFriend);
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, err);
    }
  };

  //친구 삭제
  const removeFriend = async (
    req: FastifyRequest<removeFriendRoute>,
    reply: FastifyReply,
  ) => {
    try {
      const senderId = req.user.userId;
      const { receiverId } = req.body;

      await friendService.removeFriend(senderId, receiverId);

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.cancelFriend);
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, err);
    }
  };

  return {
    getFriendList,
    addFriend,
    removeFriend,
  };
};

export default friendHandler();
