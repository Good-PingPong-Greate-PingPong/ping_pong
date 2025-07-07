import { authService } from '../services';
import { jwtUtil, SUCCESS_MESSAGE, ERROR_MESSAGE, handlerUtil } from '../lib';
import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/env';

const authHandler = () => {
  const login = async (req: FastifyRequest, reply: FastifyReply) => {
    reply.redirect('/api/auth/google');
    // req.server.googleOAuth2.generateAuthorizationUri(req, reply, (err, uri) => {
    //   if (err) {
    //     reply.code(500).send({ message: 'OAuth URL 생성 실패' });
    //     return;
    //   }
    //   reply.redirect(uri);
    // });
  };

  //front test
  const googleCallback = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const token =
        await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          req,
        );
      const { access_token } = token.token as any;

      const googleUser = await jwtUtil.getGoogleUser(access_token);
      const user = await authService.saveUser(googleUser);

      // front test :
      if (user.twoFactorEnabled) {
        const tmpToken = jwtUtil.signTmpToken({ userId: user.id });

        return reply.type('text/html; charset=UTF-8').send(`
        <script>
          window.opener.postMessage({
            status: 206,
            token: '${tmpToken}'

          }, '${env.frontendOrigin}');

          window.close();
        </script>
      `);
      }
      return finalizeLogin(reply, user.id, SUCCESS_MESSAGE.loginOK);
    } catch (error) {
      return reply.type('text/html; charset=UTF-8').send(`
      <script>
        window.opener.postMessage({
          status: 500,
          message: '로그인 중 오류가 발생했습니다.'
        }, '${env.frontendOrigin}');

        window.close();
      </script>
    `);
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

      await authService.saveRefreshToken(userId, newRefreshToken);

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
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return reply.type('text/html; charset=UTF-8').send(`
    <script>
      window.opener.postMessage({
        status: ${successMessage.status},
        user: ${JSON.stringify(user)},
        token: '${accessToken}'

      }, '${env.frontendOrigin}');
      window.close();
      </script>
  `);
  };
  return { login, googleCallback, refresh, logout, finalizeLogin };
};

export default authHandler();
