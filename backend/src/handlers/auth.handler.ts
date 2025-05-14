import { authService } from '../services';
import { jwtUtil, SUCCESS_MESSAGE, ERROR_MESSAGE, handlerUtil } from '../lib';
import { FastifyRequest, FastifyReply } from 'fastify';

const authHandler = () => {
  const login = async (req: FastifyRequest, reply: FastifyReply) => {
    reply.redirect('/auth/google');
  };

  const googleCallback = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const token =
        await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          req,
        );
      const { access_token } = token.token as any;

      const googleUser = await jwtUtil.getGoogleUser(access_token);
      const user = await authService.saveUser(googleUser);

      if (user.twoFactorEnabled) {
        const tmpToken = jwtUtil.signTmpToken({ userId: user.id });

        reply.header('Authorization', `Bearer ${tmpToken}`);
        handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.need2FA);
        return;
      }

      return finalizeLogin(reply, user.id, SUCCESS_MESSAGE.loginOK);
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, error);
    }
  };

  const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      if (!refreshToken) {
        throw new Error('no token');
      }
      const { userId, tokenRecord } = await authService.findRefreshToken(
        req.user.userId,
        refreshToken,
      );

      if (!tokenRecord || tokenRecord.token !== refreshToken) {
        throw new Error('invalid token');
      }

      const newAccessToken = jwtUtil.signAccessToken({ userId });
      const newRefreshToken = jwtUtil.signRefreshToken({ userId });

      await authService.saveRefreshToken(userId, refreshToken);

      reply.setCookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      reply.header('Authorization', `Bearer ${newAccessToken}`);
      handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.refreshToken);
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.invalidToken, error);
    }
  };

  const logout = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      handlerUtil.handleError(
        reply,
        ERROR_MESSAGE.unauthorized,
        'unauthorized',
      );
      return;
    }

    try {
      await authService.deleteRefreshToken(refreshToken);
      reply.clearCookie('refreshToken', { path: '/' });
      handlerUtil.handleSuccess(reply, SUCCESS_MESSAGE.logoutOK);
    } catch (error) {
      handlerUtil.handleError(reply, ERROR_MESSAGE.serverError, error);
    }
  };

  const finalizeLogin = async (
    reply: FastifyReply,
    id: number,
    successMessage: { success: true; status: number; message: string },
  ) => {
    const accessToken = jwtUtil.signAccessToken({ userId: id });
    const refreshToken = jwtUtil.signRefreshToken({ userId: id });

    await authService.saveRefreshToken(id, refreshToken);

    const user = await authService.findUserById(id);
    reply
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      .header('Authorization', `Bearer ${accessToken}`)
      .status(successMessage.status)
      .send({
        ...successMessage,
        user,
      });
  };
  return { login, googleCallback, refresh, logout, finalizeLogin };
};

export default authHandler();
