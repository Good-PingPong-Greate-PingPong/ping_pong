// src/schema/user.schema.ts
import {
  TUpdateUserProfileResponse,
  TGetUserProfileResponse,
  TGetUsersProfileResponse,
  TGetUsersProfileQuery,
} from './user.typebox';
/**
 * 🔹 유저 프로필 수정 API 스키마
 */
export const updateUserProfileSchema = {
  response: {
    200: TUpdateUserProfileResponse,
  },
};

/**
 * 🔹 유저 프로필 조회 API 스키마
 */
export const getUserProfileSchema = {
  response: {
    200: TGetUserProfileResponse,
  },
};

/**
 * 🔹 유저 목록 조회 API 스키마
 */
export const getUsersProfileSchema = {
  querystring: TGetUsersProfileQuery,
  response: {
    200: TGetUsersProfileResponse,
  },
};
