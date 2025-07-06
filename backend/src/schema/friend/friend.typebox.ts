import { Type } from '@sinclair/typebox';

/**
 * 🔹 친구 목록 조회 요청 쿼리 (페이지네이션)
 */
export const TGetfriendListRequest = Type.Object({
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
});

/**
 * 🔹 친구 목록 개별 항목
 */
export const TFriend = Type.Object({
  id: Type.Number(),
  nickname: Type.String(),
  profile_image: Type.Optional(Type.String()),
});

/**
 * 🔹 친구 목록 조회 응답
 */
export const TGetfriendListResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
  data: Type.Object({
    totalPage: Type.Number(),
    currentPage: Type.Number(),
    friend: Type.Array(TFriend),
  }),
});

/**
 * 🔹 친구 추가/삭제 요청 (nickname, receiverId 필요)
 */
export const TAddFriendRequest = Type.Object({
  nickname: Type.String(),
});

export const TRemoveFriendRequest = Type.Object({
  receiverId: Type.Number(),
});
/**
 * 🔹 친구 추가/삭제 성공 응답
 */
export const TModifyFriendResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
});
