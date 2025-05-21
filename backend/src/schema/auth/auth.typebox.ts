import { Type, Static } from '@sinclair/typebox';

export const TBaseResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
});

export const TUser = Type.Object({
  id: Type.Integer(), // `id`는 숫자
  nickname: Type.String(), // `nickname`은 문자열
  password: Type.String(), // `password`는 문자열
  email: Type.String(), // `email`은 문자열
  profileImage: Type.Optional(Type.String()), // `profileImage`는 선택적 문자열
  twoFactorEnabled: Type.Boolean(), // `twoFactorEnabled`는 boolean
  twoFactorSecret: Type.Optional(Type.String()), // `twoFactorSecret`은 선택적 문자열
  createdAt: Type.String(), // `createdAt`은 문자열 형식으로 `DateTime`을 저장
  updatedAt: Type.String(), // `updatedAt`도 문자열 형식으로 `DateTime`을 저장
  isDeleted: Type.Boolean(), // `isDeleted`는 boolean
});

export const TGoogleCallbackRequest = Type.Object({
  code: Type.String(), // 구글 인증 코드
});

export const TGoogleCallbackResponse = Type.Intersect([
  TBaseResponse,
  Type.Object({
    user: TUser,
  }),
]);

export const TRefreshRequest = Type.Object({
  refreshToken: Type.String(),
});

export const TRefreshResponse = Type.Intersect([
  TBaseResponse,
  Type.Object({
    accessToken: Type.String(),
  }),
]);

export const TLogoutResponse = TBaseResponse;
export type GoogleCallbackRequest = Static<typeof TGoogleCallbackRequest>;
export type GoogleCallbackResponse = Static<typeof TGoogleCallbackResponse>;
export type RefreshRequest = Static<typeof TRefreshRequest>;
export type RefreshResponse = Static<typeof TRefreshResponse>;
export type LogoutResponse = Static<typeof TLogoutResponse>;
