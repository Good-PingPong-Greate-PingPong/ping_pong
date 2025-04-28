import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { FastifyRequest, FastifyReply, TokenPayload } from 'fastify';
import { ERROR_MESSAGE } from './constants';

const jwtUtil = () => {
  const getGoogleUser = async (accessToken: string) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) throw new Error('Google user fetch failed');
    return await res.json();
  };

  const signAccessToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, secret, options);
  };

  const signTmpToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: '5m',
    };
    return jwt.sign({ ...payload, twoFactorPending: true }, secret, options);
  };

  const signRefreshToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, secret, options);
  };

  const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  };

  const verifyAccessToken = async (
    request: FastifyRequest,
    reply: FastifyReply,
    options: { expectTmpToken: boolean },
  ) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply
        .code(ERROR_MESSAGE.unauthorized.status)
        .send(ERROR_MESSAGE.unauthorized);
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      if (decoded.twoFactorPending && !options.expectTmpToken) {
        return reply
          .code(ERROR_MESSAGE.not2FA.status)
          .send(ERROR_MESSAGE.not2FA);
      }
      request.user = decoded;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return reply
          .code(ERROR_MESSAGE.expired.status)
          .send(ERROR_MESSAGE.expired);
      }
      return reply
        .code(ERROR_MESSAGE.invalidToken.status)
        .send(ERROR_MESSAGE.invalidToken);
    }
  };

  return {
    getGoogleUser,
    signAccessToken,
    signRefreshToken,
    signTmpToken,
    verifyToken,
    verifyAccessToken,
  };
};

export default jwtUtil();
