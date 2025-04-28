import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { FastifyRequest, FastifyReply, TokenPayload } from 'fastify';
import { ERROR_MESSAGE } from './constants';

export async function getGoogleUser(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
	headers: {
	  Authorization: `Bearer ${accessToken}`,
	},
  });

  if (!res.ok) throw new Error('Google user fetch failed');
  return await res.json();
}

export function signAccessToken(payload: object) {
  const secret: Secret = config.jwt.secret as Secret;
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function signRefreshToken(payload: object) {
  const secret: Secret = config.jwt.secret as Secret;
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
}

export async function verifyAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply
      .code(ERROR_MESSAGE.unauthorized.status)
      .send(ERROR_MESSAGE.unauthorized);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
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
}
