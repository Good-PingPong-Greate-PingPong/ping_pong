import {
  TGoogleCallbackRequest,
  TGoogleCallbackResponse,
  TLogoutResponse,
  TRefreshRequest,
  TRefreshResponse,
} from './auth.typebox';
import { Type } from '@sinclair/typebox';

export const googleCallbackSchema = {
  querystring: TGoogleCallbackRequest,
  response: {
    201: TGoogleCallbackResponse,
  },
};

export const logoutSchema = {
  response: {
    205: TLogoutResponse,
  },
};

export const refreshSchema = {
  // body: TRefreshRequest,
  response: {
    201: TRefreshResponse,
  },
};
