// src/schema/user.typebox.ts
import { Type } from '@sinclair/typebox';

/**
 * 🔹 유저 프로필 업데이트 요청 스키마
 */
const TUpdateUserProfileRequest = Type.Partial(
  Type.Object({
    nickname: Type.String(),
    twoFactorEnabled: Type.Boolean(),
    profileImage: Type.String(), // 파일 URL 문자열 (파일 업로드 후 저장되는 경로)
  }),
);

/**
 * 🔹 유저 프로필 응답 공통 스키마
 */
const TUserProfileData = Type.Object({
  id: Type.Number(),
  nickname: Type.String(),
  email: Type.String(),
  profileImage: Type.Optional(Type.String()),
  twoFactorEnabled: Type.Boolean(),
});

/**
 * 🔹 유저 프로필 업데이트 성공 응답 스키마
 */
const TUpdateUserProfileResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
  user: TUserProfileData,
});

/**
 * 🔹 유저 프로필 조회 성공 응답 스키마
 */
const TGetUserProfileResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
  user: TUserProfileData,
});

export {
  TUpdateUserProfileRequest,
  TUpdateUserProfileResponse,
  TGetUserProfileResponse,
};
