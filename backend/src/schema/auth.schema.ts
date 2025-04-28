import {
  TLoginRequest,
  TLoginResponse,
  TLogoutResponse,
  TRefreshRequest,
  TRefreshResponse,
} from './auth.typebox';

export const loginSchema = {
  body: TLoginRequest,
  response: {
    201: TLoginResponse,
  },
};

export const logoutSchema = {
  response: {
    205: TLogoutResponse,
  },
};

export const refreshSchema = {
  body: TRefreshRequest,
  response: {
    201: TRefreshResponse,
  },
};
