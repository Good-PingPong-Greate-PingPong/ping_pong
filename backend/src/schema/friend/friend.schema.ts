import {
  TGetFriendsListResponse,
  TGetFriendsListRequest,
  TModifyFriendRequest,
  TModifyFriendResponse,
} from './friend.typebox';

/**
 * 🔹 친구 목록 조회 스키마
 */
export const getFriendsListSchema = {
  querystring: TGetFriendsListRequest,
  response: {
    200: TGetFriendsListResponse,
  },
};

/**
 * 🔹 친구 추가 스키마
 */
export const addFriendSchema = {
  body: TModifyFriendRequest,
  response: {
    200: TModifyFriendResponse,
  },
};

/**
 * 🔹 친구 삭제 스키마
 */
export const removeFriendSchema = {
  body: TModifyFriendRequest,
  response: {
    200: TModifyFriendResponse,
  },
};
