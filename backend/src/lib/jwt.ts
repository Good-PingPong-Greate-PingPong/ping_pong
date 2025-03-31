import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from './constants';

export function signAccessToken(payload: object) {
  const secret: Secret = config.jwt.secret as Secret;
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export async function verifyAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    reply
      .code(ERROR_MESSAGE.unauthorized.status)
      .send(ERROR_MESSAGE.unauthorized);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    request.user = decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      reply.code(ERROR_MESSAGE.expired.status).send(ERROR_MESSAGE.expired);
    } else {
      reply
        .code(ERROR_MESSAGE.invalidToken.status)
        .send(ERROR_MESSAGE.invalidToken);
    }
  }
}
