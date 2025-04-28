import { FastifyRequest, FastifyReply } from 'fastify';
import { twoFAService } from '../services';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib';

const twoFAHandler = () => {
  /**
   * 2FA 설정용 QR코드 생성 핸들러
   */
  const setup = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.id;

    try {
      const result = await twoFAService.generate2FASetup(userId);

      return reply.status(SUCCESS_MESSAGE.generate2FA.status).send({
        ...SUCCESS_MESSAGE.generate2FA,
        qrCode: result.qrCode,
      });
    } catch (error) {
      req.log.error(error);
      return reply
        .status(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
    }
  };

  /**
   * 2FA 코드 검증 핸들러
   */
  const verify = async (
    req: FastifyRequest<{ Body: { code: string } }>,
    reply: FastifyReply,
  ) => {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return reply
        .status(ERROR_MESSAGE.badRequest.status)
        .send(ERROR_MESSAGE.badRequest);
    }

    try {
      const isVerified = await twoFAService.verify2FACode(userId, code);

      if (!isVerified) {
        return reply
          .status(ERROR_MESSAGE.invalidToken.status)
          .send(ERROR_MESSAGE.invalidToken);
      }

      return reply
        .status(SUCCESS_MESSAGE.verify2FA.status)
        .send(SUCCESS_MESSAGE.verify2FA);
    } catch (error) {
      req.log.error(error);
      return reply
        .status(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
    }
  };

  return {
    setup,
    verify,
  };
};

export default twoFAHandler();
