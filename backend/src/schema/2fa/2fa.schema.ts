import {
  TGenerate2FASetupResponse,
  TVerify2FARequest,
  TVerify2FAResponse,
  TResetRequestResponse,
  TResetConfirmQuery,
  TResetConfirmResponse,
} from './2fa.typebox';

/**
 * 2FA QR 생성 API 스키마
 */
export const generate2FASchema = {
  response: {
    200: TGenerate2FASetupResponse,
  },
};

/**
 * 2FA 코드 검증 API 스키마
 */
export const verify2FASchema = {
  body: TVerify2FARequest,
  response: {
    200: TVerify2FAResponse,
  },
};

export const resetRequestSchema = {
  response: {
    200: TResetRequestResponse,
  },
};

export const resetConfirmSchema = {
  querystring: TResetConfirmQuery,
  response: {
    200: TResetConfirmResponse,
  },
};
