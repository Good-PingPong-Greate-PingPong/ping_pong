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
});

export type Generate2FASetupResponse = Static<typeof TGenerate2FASetupResponse>;
export type Verify2FARequest = Static<typeof TVerify2FARequest>;
export type Verify2FAResponse = Static<typeof TVerify2FAResponse>;
