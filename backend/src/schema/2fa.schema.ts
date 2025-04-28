import {
  generate2FASetupResponse,
  verify2FARequest,
  verify2FAResponse,
} from './2fa.typebox';

/**
 * 2FA QR 생성 API 스키마
 */
export const generate2FASchema = {
  response: {
    200: generate2FASetupResponse,
  },
};

/**
 * 2FA 코드 검증 API 스키마
 */
export const verify2FASchema = {
  body: verify2FARequest,
  response: {
    200: verify2FAResponse,
  },
};
