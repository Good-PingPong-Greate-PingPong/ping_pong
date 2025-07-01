import {
  TGetfriendListResponse,
  TGetfriendListRequest,
  TAddFriendRequest,
  TRemoveFriendRequest,
  TModifyFriendResponse,
} from './friend.typebox';

/**
 * 🔹 친구 목록 조회 스키마
 */
export const getfriendListSchema = {
  querystring: TGetfriendListRequest,
  response: {
    200: TGetfriendListResponse,
  },
};

/**
 * 🔹 친구 추가 스키마
 */
export const addfriendchema = {
  querystring: TAddFriendRequest,
  response: {
    200: TModifyFriendResponse,
  },
};

/**
 * 🔹 친구 삭제 스키마
 */
export const removefriendchema = {
  body: TRemoveFriendRequest,
  response: {
    200: TModifyFriendResponse,
  },
};
