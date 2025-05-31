// src/schema/user.typebox.ts
import { Type } from '@sinclair/typebox';

/**
 * 🔹 유저 프로필 업데이트 요청 스키마
 */
const TUpdateUserProfileRequest = Type.Partial(
  Type.Object({
    nickname: Type.String({ minLength: 1, maxLength: 30 }),
    email: Type.String({ format: 'email' }),
    twoFactorEnabled: Type.Boolean(),
    profileImage: Type.String(), // 파일 URL 문자열 (파일 업로드 후 저장되는 경로)
  }),
);

/**
 * 🔹 유저 프로필 업데이트 성공 응답 스키마
 */
const TUpdateUserProfileResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
  user: Type.Object({
    id: Type.Number(),
    nickname: Type.String(),
    email: Type.String(),
    profileImage: Type.Optional(Type.String()),
    twoFactorEnabled: Type.Boolean(),
  }),
});

export {
  TUpdateUserProfileRequest,
  TUpdateUserProfileResponse,
};