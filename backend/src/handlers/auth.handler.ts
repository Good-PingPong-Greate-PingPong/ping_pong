import * as service from '../services';
import {
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  signAccessToken,
  signRefreshToken,
  verifyToken,
  getGoogleUser,
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

    const googleUser = await getGoogleUser(access_token);
    const user = await service.saveUser(googleUser);
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    await service.saveRefreshToken(user.id, refreshToken);
    reply
      .setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // 개발 환경에서는 false로 설정 추후 수정
        sameSite: 'strict', // CSRF 방지
        path: '/', // 이 경로 요청 시에만 자동 첨부
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
      path: '/',
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
