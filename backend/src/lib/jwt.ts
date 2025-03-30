import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from '../config';

export function signAccessToken(payload: object) {
  const secret: Secret = config.jwt.secret as Secret;
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}
