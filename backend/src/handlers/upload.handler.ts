import { FastifyRequest, FastifyReply } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE, handlerUtil } from '../lib';
import { uploadService } from '../services';

const uploadHandler = () => {
  const uploadProfileImage = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    if (!req.isMultipart()) {
      handlerUtil.handleError(
        reply,
        ERROR_MESSAGE.badRequest,
        'multipart/form-data 형식이 아닙니다',
      );
      return;
    }

    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'profileImage') {
        try {
          const imageUrl = await uploadService.saveProfileImage(
            part.file,
            part.filename,
          );
          handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.uploadProfileImage, {
            imageUrl,
          });
        } catch (error) {
          handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, error);
        }
      }
    }

    return reply.status(ERROR_MESSAGE.badRequest.status).send({
      ...ERROR_MESSAGE.badRequest,
      message: 'profileImage 파일이 없습니다',
    });
  };

  return {
    uploadProfileImage,
  };
};

export default uploadHandler();
