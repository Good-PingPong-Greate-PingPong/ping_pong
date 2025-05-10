import { authService } from '../services';
import { jwtUtil, SUCCESS_MESSAGE, ERROR_MESSAGE, handleError } from '../lib';
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

        return reply
          .header('Authorization', `Bearer ${tmpToken}`)
          .code(SUCCESS_MESSAGE.need2FA.status)
          .send({
            ...SUCCESS_MESSAGE.need2FA,
          });
      }

      return finalizeLogin(reply, user.id, SUCCESS_MESSAGE.loginOK);
    } catch (error) {
      handleError(reply, ERROR_MESSAGE.serverError, error);
    }
  };

  const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return reply
        .code(ERROR_MESSAGE.unauthorized.status)
        .send(ERROR_MESSAGE.unauthorized);
    }

    try {
      const decoded = jwtUtil.verifyToken(refreshToken);
      const { userId, tokenRecord } = await authService.findRefreshToken(
        decoded.userId,
        refreshToken,
      );

      if (!tokenRecord) {
        return reply
          .code(ERROR_MESSAGE.invalidToken.status)
          .send(ERROR_MESSAGE.invalidToken);
      }

      const newAccessToken = jwtUtil.signAccessToken({ userId });
      return reply.send({
        ...SUCCESS_MESSAGE.refreshToken,
        accessToken: newAccessToken,
      });
    } catch (err) {
      return reply
        .code(ERROR_MESSAGE.invalidToken.status)
        .send(ERROR_MESSAGE.invalidToken);
    }
  };

  const logout = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      handleError(reply, ERROR_MESSAGE.unauthorized, 'unauthorized');
      return;
    }

    try {
      await authService.deleteRefreshToken(refreshToken);
      reply.clearCookie('refreshToken', { path: '/' });

      return reply
        .code(SUCCESS_MESSAGE.logoutOK.status)
        .send(SUCCESS_MESSAGE.logoutOK);
    } catch (error) {
      handleError(reply, ERROR_MESSAGE.serverError, error);
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
    return reply
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      .header('Authorization', `Bearer ${accessToken}`)
      .code(successMessage.status)
      .send({
        ...successMessage,
        user,
      });
  };
  return { login, googleCallback, refresh, logout, finalizeLogin };
};

export default authHandler();
