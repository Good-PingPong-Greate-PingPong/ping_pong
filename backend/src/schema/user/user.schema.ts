// src/schema/user.schema.ts
import {
  TUpdateUserProfileResponse,
  TGetUserProfileResponse,
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
