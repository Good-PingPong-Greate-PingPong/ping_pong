// handlers/profile.handler.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { handlerUtil, userUtil } from '../lib';
import userService from '../services/user.service';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib';

const profileHandler = () => {
  const uploadProfileInfo = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    if (!req.isMultipart()) {
      handlerUtil.handleError(
        reply,
        ERROR_MESSAGE.badRequest,
        'Multipart 요청이 아닙니다',
      );
    }

    try {
      const userId = req.user.userId;
      const parts = req.parts();

      const updateData = await userUtil.parseUserProfileParts(parts);

      if (Object.keys(updateData).length === 0) {
        handlerUtil.handleError(
          reply,
          ERROR_MESSAGE.badRequest,
          '업데이트할 정보가 없습니다',
        );
        return;
      }

      const updatedUser = await userService.updateUserProfileInfo(
        userId,
        updateData,
      );

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.updateProfile, {
        user: updatedUser,
      });
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, err);
    }
  };
  const getProfileInfo = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = req.user.userId;

      const profile = await userService.getUserProfile(userId);

      if (!profile) {
        return handlerUtil.handleError(
          reply,
          ERROR_MESSAGE.notFound,
          '유저 정보 없음',
        );
      }

      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.getProfile, {
        user: profile,
      });
    } catch (err) {
      return handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, err);
    }
  };

  return {
    uploadProfileInfo,
    getProfileInfo,
  };
};

export default profileHandler();
