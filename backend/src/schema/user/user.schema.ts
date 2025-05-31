// src/schema/user.schema.ts
import {
  TUpdateUserProfileRequest,
  TUpdateUserProfileResponse,
} from './user.typebox';

/**
 * 🔹 유저 프로필 수정 API 스키마
 */
export const updateUserProfileSchema = {
  body: TUpdateUserProfileRequest,
  response: {
    200: TUpdateUserProfileResponse,
  },
};
