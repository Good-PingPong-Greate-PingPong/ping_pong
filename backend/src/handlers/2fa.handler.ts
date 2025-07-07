import { FastifyRequest, FastifyReply } from 'fastify';
import { twoFAService } from '../services';
import {
  mailer,
  jwtUtil,
  handlerUtil,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
} from '../lib';
import { ResetConfirmQuery } from '../schema/type';

const twoFAHandler = () => {
  /**
   * 2FA 설정용 QR코드 생성 핸들러
   */
  const setup = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;
    try {
      const result = await twoFAService.generate2FASetup(userId);
      handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.generate2FA, {
        qrCode: result.qrCode,
      });
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, error);
    }
  };

  /**
   * 2FA 코드 검증 핸들러
   */
  const verify = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;
    const { code } = req.body as { code: string };

    if (!code) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.badRequest, 'no token');
      return;
    }

    try {
      const isVerified = await twoFAService.verify2FACode(userId, code);

      if (!isVerified) {
        handlerUtil.handleError(
          reply,
          ERROR_MESSAGE.invalidToken,
          'invalid token',
        );
      }

      const user = await twoFAService.findUserById(userId);
      if (!user) {
        handlerUtil.handleError(reply, ERROR_MESSAGE.notFound, 'No user found');
        return;
      }
      const accessToken = jwtUtil.signAccessToken({ userId: user.id });
      const refreshToken = jwtUtil.signRefreshToken({ userId: user.id });
      let userData = {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
        profileImage: user.profileImage,
        accessToken: accessToken,
      };
      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.verify2FA, {
        user: userData,
      });
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, error);
    }
  };

  /**
   * 2FA 코드 초기화 핸들러
   */
  const resetRequest = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user.userId;

    const user = await twoFAService.findUserById(userId);
    try {
      if (!user) {
        throw new Error('No user');
      }
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.notFound, error);
      return;
    }

    const resetToken = jwtUtil.signResetToken({ userId });
    try {
      await mailer.sendResetEmail(user.email, resetToken);
      handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.sendMail);
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, error);
    }
  };

  const resetConfirm = async (
    req: FastifyRequest<{ Querystring: ResetConfirmQuery }>,
    reply: FastifyReply,
  ) => {
    try {
      req.headers.authorization = `Bearer ${req.query.token}`;
      jwtUtil.verifyToken(req, reply, 'reset_token');
      const userId = req.user.userId;

      if (!userId) throw new Error('Invalid token');

      await twoFAService.reset2FA(userId);

      handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.reset2FA);
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.invalidToken, error);
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
