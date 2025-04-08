import * as service from '../services';
import {
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from '../lib';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function googleCallbackHandler(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token =
      await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        req,
      );
    const { access_token } = token.token as any;

    const googleUser = await service.getGoogleUser(access_token);
    const user = await service.handleGoogleUser(googleUser);
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    await service.saveRefreshToken(user.id, refreshToken);
    reply
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // CSRF 방지
        path: '/api/auth/refresh', // 이 경로 요청 시에만 자동 첨부
        maxAge: 60 * 60 * 24 * 7, // 7일
      })
      .code(SUCCESS_MESSAGE.loginOK.status)
      .send({
        ...SUCCESS_MESSAGE.loginOK,
        accessToken,
        user,
      });
  } catch (err) {
    req.log.error(err);
    reply
      .code(ERROR_MESSAGE.serverError.status)
      .send(ERROR_MESSAGE.serverError);
  }
}

export async function logoutHandler(req: FastifyRequest, reply: FastifyReply) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return reply
      .code(ERROR_MESSAGE.unauthorized.status)
      .send(ERROR_MESSAGE.unauthorized);
  }

  try {
    await service.deleteRefreshToken(refreshToken);

    reply.clearCookie('refreshToken', {
      path: '/api/auth/refresh',
    });

    return reply
      .code(SUCCESS_MESSAGE.logoutOK.status)
      .send(SUCCESS_MESSAGE.logoutOK);
  } catch (err) {
    return reply
      .code(ERROR_MESSAGE.serverError.status)
      .send(ERROR_MESSAGE.serverError);
  }
}

export async function refreshHandler(req: FastifyRequest, reply: FastifyReply) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return reply
      .code(ERROR_MESSAGE.unauthorized.status)
      .send(ERROR_MESSAGE.unauthorized);
  }

  try {
    const decoded = verifyToken(refreshToken);
    const { userId, tokenRecord } = await service.findRefreshToken(
      decoded.userId,
      refreshToken,
    );

    if (!tokenRecord) {
      return reply
        .code(ERROR_MESSAGE.invalidToken.status)
        .send(ERROR_MESSAGE.invalidToken);
    }

    const newAccessToken = signAccessToken({ userId });

    return reply.send({
      ...SUCCESS_MESSAGE.refreshToken,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return reply
      .code(ERROR_MESSAGE.invalidToken.status)
      .send(ERROR_MESSAGE.invalidToken);
  }
}
