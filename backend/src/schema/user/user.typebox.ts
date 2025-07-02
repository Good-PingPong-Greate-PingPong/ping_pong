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
 * 🔹 유저 목록 응답용 단일 유저 정보
 */
const TUserSummary = Type.Object({
  id: Type.Number(),
  nickname: Type.String(),
  profileImage: Type.Optional(Type.String()),
  isFriend: Type.Boolean(),
  isLogin: Type.Boolean(),
});

/**
 * 🔹 유저 목록 조회 요청 쿼리
 */
const TGetUsersProfileQuery = Type.Object({
  nickname: Type.String(),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
});

/**
 * 🔹 유저 목록 조회 성공 응답 스키마
 */
const TGetUsersProfileResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
  total_page: Type.Number(),
  current_page: Type.Number(),
  users: Type.Array(TUserSummary),
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
  TGetUsersProfileResponse,
  TGetUsersProfileQuery,
};
