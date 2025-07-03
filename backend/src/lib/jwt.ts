import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';
import { FastifyRequest, FastifyReply, TokenPayload } from 'fastify';
import { ERROR_MESSAGE } from './constants';
import { handlerUtil } from './';

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

  // Access Token - 서비스용
  const signAccessToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign({ ...payload, tokenType: 'access_token' }, secret, options);
  };

  // Tmp Token - 2FA 인증용
  const signTmpToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    return jwt.sign({ ...payload, tokenType: 'tmp_token' }, secret, {
      expiresIn: '5m',
    });
  };

  // Refresh Token - Access Token 갱신용
  const signRefreshToken = (payload: object) => {
    const secret: Secret = config.jwt.secret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(
      { ...payload, tokenType: 'refresh_token' },
      secret,
      options,
    );
  };

  // Reset Token - 2FA 초기화용
  const signResetToken = (payload: { userId: number }) => {
    const secret = config.jwt.secret;
    return jwt.sign({ ...payload, tokenType: 'reset_token' }, secret, {
      expiresIn: '5m',
    });
  };

  const verifyValidToken = (token: string): TokenPayload => {
    try {
      return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch {
      throw new Error('Invalid token!');
    }
  };

  const extractTokenFromHeader = (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('token is not included');
    }

    return authHeader.split(' ')[1];
  };

  const checkTokenType = (decoded: TokenPayload, expectedType: string) => {
    if (decoded.tokenType !== expectedType) {
      throw new Error(
        `Invalid token type. Expected ${expectedType}, got ${decoded.tokenType}`,
      );
    }
  };

  const coreVerifyToken = (token: string, codetype: string) => {
    const decoded = verifyValidToken(token);
    checkTokenType(decoded, codetype);
    return decoded;
  };

  const verifyToken = async (
    request: FastifyRequest,
    reply: FastifyReply,
    codetype: string,
  ) => {
    try {
      const token = extractTokenFromHeader(request, reply);
      const decoded = coreVerifyToken(token, codetype);
      request.user = decoded;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        handlerUtil.handleError(reply, ERROR_MESSAGE.expired, err);
      } else {
        handlerUtil.handleError(reply, ERROR_MESSAGE.invalidToken, err);
      }
    }
  };

  const verifyTokenPreHandler = (codetype: string) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      await verifyToken(req, reply, codetype);
    };
  };

  const tokenTypes = {
    access: 'access_token',
    reset: 'reset_token',
    tmp: 'tmp_token',
    refresh: 'refresh_token',
  };
  return {
    getGoogleUser,
    signAccessToken,
    signRefreshToken,
    signResetToken,
    signTmpToken,
    verifyToken,
    verifyTokenPreHandler,
    coreVerifyToken,
    tokenTypes,
  };
};

export default jwtUtil();
