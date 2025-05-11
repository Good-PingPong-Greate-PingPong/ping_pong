import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { FastifyRequest, FastifyReply, TokenPayload } from 'fastify';
import { ERROR_MESSAGE } from './constants';
import { handleError } from './error.handler';

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
    return jwt.sign({ ...payload, twoFactorPending: true }, secret, {
      expiresIn: '5m',
    });
  };

  const signRefreshToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, secret, options);
  };
  const signResetToken = (payload: { userId: number }) => {
    const secret = config.jwt.secret;
    return jwt.sign(payload, secret, { expiresIn: '5m' });
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
      handleError(reply, ERROR_MESSAGE.unauthorized, 'unauthorized');
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      if (decoded.twoFactorPending && !options.expectTmpToken) {
        handleError(reply, ERROR_MESSAGE.not2FA, 'not 2fa');
        return;
      }
      request.user = decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        handleError(reply, ERROR_MESSAGE.expired, error);
      } else {
        handleError(reply, ERROR_MESSAGE.invalidToken, error);
      }
    }
  };

  return {
    getGoogleUser,
    signAccessToken,
    signRefreshToken,
    signResetToken,
    signTmpToken,
    verifyToken,
    verifyAccessToken,
  };
};

export default jwtUtil();
