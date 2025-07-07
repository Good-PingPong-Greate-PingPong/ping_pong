import { Type, Static } from '@sinclair/typebox';

/**
 * 2FA Setup (QR코드 생성) 성공 응답 스키마
 */
export const TGenerate2FASetupResponse = Type.Intersect([
  Type.Object({
    success: Type.Boolean(),
    status: Type.Number(),
    message: Type.String(),
  }),
  Type.Object({
    qrCode: Type.String(), // base64 인코딩된 QR 이미지 URL
  }),
]);

/**
 * 2FA Verify 요청 바디 스키마
 */
export const TVerify2FARequest = Type.Object({
  code: Type.String({ minLength: 6, maxLength: 6 }), // 6자리 OTP 코드
});

/**
 * 2FA Verify 성공 응답 스키마
 */
export const TVerify2FAResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
  user: Type.Object({
    id: Type.Number(),
    nickname: Type.String(),
    email: Type.String({ format: 'email' }),
    profileImage: Type.Optional(Type.String()),
    twoFactorEnabled: Type.Boolean(),
    accessToken: Type.String(),
  }),
});

/**
 * 🔹 /api/2fa/reset-request
 * - 요청 바디는 없음
 * - 응답은 기본 성공 메시지
 */
export const TResetRequestResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
});

/**
 * 🔹 /api/2fa/reset-confirm
 * - 요청 쿼리: token
 * - 응답은 기본 성공 메시지
 */
export const TResetConfirmQuery = Type.Object({
  token: Type.String(),
});

export const TResetConfirmResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
});

export type Generate2FASetupResponse = Static<typeof TGenerate2FASetupResponse>;
export type Verify2FARequest = Static<typeof TVerify2FARequest>;
export type Verify2FAResponse = Static<typeof TVerify2FAResponse>;
export type ResetRequestResponse = Static<typeof TResetRequestResponse>;
export type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;
export type ResetConfirmResponse = Static<typeof TResetConfirmResponse>;
