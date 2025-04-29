import { FastifyRequest, FastifyReply } from 'fastify';
import { twoFAService } from '../services';
import authHandler from './auth.handler';
import { mailer, jwtUtil, ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib';

const twoFAHandler = () => {
  /**
   * 2FA 설정용 QR코드 생성 핸들러
   */
  const setup = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;

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
  const verify = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;
    const { code } = req.body as { code: string };

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

      return authHandler.finalizeLogin(
        reply,
        userId,
        SUCCESS_MESSAGE.verify2FA,
      );
    } catch (error) {
      req.log.error(error);
      return reply
        .status(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
    }
  };

  /**
   * 2FA 코드 초기화 핸들러
   */
  const resetRequest = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;

    const user = await twoFAService.findUserById(userId);
    if (!user) {
      return reply
        .status(ERROR_MESSAGE.notFound.status)
        .send(ERROR_MESSAGE.notFound);
    }

    const resetToken = jwtUtil.signResetToken({ userId });
    try {
      await mailer.sendResetEmail(user.email, resetToken);
      return reply
        .status(SUCCESS_MESSAGE.sendMail.status)
        .send(SUCCESS_MESSAGE.sendMail);
    } catch (error) {
      req.log.error(error);
      return reply
        .status(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
    }
  };

  const resetConfirm = async (
    req: FastifyRequest<{ Querystring: { token: string } }>,
    reply: FastifyReply,
  ) => {
    const { token } = req.query;

    if (!token) {
      return reply
        .status(ERROR_MESSAGE.invalidToken.status)
        .send(ERROR_MESSAGE.invalidToken);
    }

    try {
      const decoded = jwtUtil.verifyToken(token);

      const userId = decoded.userId;

      if (!userId) {
        return reply
          .status(ERROR_MESSAGE.invalidToken.status)
          .send(ERROR_MESSAGE.invalidToken);
      }

      await twoFAService.reset2FA(userId);

      return reply.code(200).send({
        ...SUCCESS_MESSAGE.reset2FA,
      });
    } catch (error) {
      req.log.error(error);
      return reply
        .status(ERROR_MESSAGE.invalidToken.status)
        .send(ERROR_MESSAGE.invalidToken);
    }
  };
  return {
    setup,
    verify,
    resetRequest,
    resetConfirm,
  };
};

export default twoFAHandler();
