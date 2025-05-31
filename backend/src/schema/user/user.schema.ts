// src/schema/user.schema.ts
import { TUpdateUserProfileResponse } from './user.typebox';

/**
 * 🔹 유저 프로필 수정 API 스키마
 */
export const updateUserProfileSchema = {
  response: {
    200: TUpdateUserProfileResponse,
  },
};
