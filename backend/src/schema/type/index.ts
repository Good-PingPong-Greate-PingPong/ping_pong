import { Static } from '@sinclair/typebox';

import {
  TCreateLocalGameRequest,
  TCreateLocalGameResponse,
  TReadLocalGameResponse,
} from '../localgame/localgame.typebox';

import { TResetConfirmQuery } from '../2fa/2fa.typebox';

import {
  TUpdateUserProfileRequest,
  TUpdateUserProfileResponse,
} from '../user/user.typebox';

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;
type ReadLocalGameResponse = Static<typeof TReadLocalGameResponse>;
type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;
type UpdateUserProfileRequest = Static<typeof TUpdateUserProfileRequest>;
type UpdateUserProfileResponse = Static<typeof TUpdateUserProfileResponse>;

type CreateLocalGameRoute = {
  Body: CreateLocalGameRequest;
};

type ListQueryRoute = {
  Querystring: {
    page: number;
    offset: number;
  };
};

export {
  CreateLocalGameRequest,
  CreateLocalGameResponse,
  ReadLocalGameResponse,
  ResetConfirmQuery,
  CreateLocalGameRoute,
  ListQueryRoute,
};
