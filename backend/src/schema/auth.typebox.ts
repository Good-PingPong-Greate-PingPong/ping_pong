import { Type, Static } from '@sinclair/typebox';

export const TLoginRequest = Type.Object({
  google_token: Type.String(),
});

export const TRefreshRequest = Type.Object({
  refreshToken: Type.String(),
});

export const TBaseResponse = Type.Object({
  success: Type.Boolean(),
  status: Type.Number(),
  message: Type.String(),
});

export const TLoginResponse = Type.Intersect([
  TBaseResponse,
  Type.Object({
    accessToken: Type.String(),
    refreshToken: Type.String(),
    user: Type.Number(), // ← 필요 시 명확히 정의해도 됨
  }),
]);

export const TRefreshResponse = Type.Intersect([
  TBaseResponse,
  Type.Object({
    accessToken: Type.String(),
  }),
]);

export const TLogoutResponse = TBaseResponse;

export type LoginRequest = Static<typeof TLoginRequest>;
export type RefreshRequest = Static<typeof TRefreshRequest>;
export type LoginResponse = Static<typeof TLoginResponse>;
export type RefreshResponse = Static<typeof TRefreshResponse>;
export type LogoutResponse = Static<typeof TLogoutResponse>;
