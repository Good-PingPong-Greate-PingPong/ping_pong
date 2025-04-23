import { authService } from '../services';
import { jwtUtil, SUCCESS_MESSAGE, ERROR_MESSAGE } from '../lib';
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

      const accessToken = jwtUtil.signAccessToken({ userId: user.id });
      const refreshToken = jwtUtil.signRefreshToken({ userId: user.id });
      await authService.saveRefreshToken(user.id, refreshToken);

      reply
        .setCookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false, // 개발 환경에서는 false, 배포 시 true
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7일
        })
        .header('Authorization', `Bearer ${accessToken}`)
        .code(SUCCESS_MESSAGE.loginOK.status)
        .send({
          ...SUCCESS_MESSAGE.loginOK,
          user,
        });
    } catch (err) {
      req.log.error(err);
      reply
        .code(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
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
      return reply
        .code(ERROR_MESSAGE.unauthorized.status)
        .send(ERROR_MESSAGE.unauthorized);
    }

    try {
      await authService.deleteRefreshToken(refreshToken);
      reply.clearCookie('refreshToken', { path: '/' });

      return reply
        .code(SUCCESS_MESSAGE.logoutOK.status)
        .send(SUCCESS_MESSAGE.logoutOK);
    } catch (err) {
      return reply
        .code(ERROR_MESSAGE.serverError.status)
        .send(ERROR_MESSAGE.serverError);
    }
  };

  return { login, googleCallback, refresh, logout };
};

export default authHandler();
