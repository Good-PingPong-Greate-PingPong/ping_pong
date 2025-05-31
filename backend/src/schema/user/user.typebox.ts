// src/schema/user.typebox.ts
import { Type } from '@sinclair/typebox';

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

export { TUpdateUserProfileResponse };
