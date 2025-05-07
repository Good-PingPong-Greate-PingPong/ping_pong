import { FastifyRequest, FastifyReply } from 'fastify';
import { profileService } from '../services';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib';

const profileHandler = () => {
  /**
   * 프로필 이미지 업데이트
   */
  const updateImage = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;
    const { profileImage } = req.body as { profileImage: string };

    if (!profileImage) {
      return reply
        .status(ERROR_MESSAGE.badRequest.status)
        .send(ERROR_MESSAGE.badRequest);
    }

    try {
      const updatedUser = await profileService.updateProfileImage(
        userId,
        profileImage,
      );

      return reply.status(SUCCESS_MESSAGE.updateProfile.status).send({
        ...SUCCESS_MESSAGE.updateProfile,
        data: updatedUser,
      });
    } catch (error) {
      req.log.error(error);
      return reply
        .status(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
    }
  };

  return {
    updateImage,
    // 앞으로 여기에 추가할 항목들
    // getProfile,
    // updateProfileInfo,
  };
};

export default profileHandler();
