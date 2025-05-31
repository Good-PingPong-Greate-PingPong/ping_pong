import { Static } from '@sinclair/typebox';

import {
  TCreateLocalGameRequest,
  TCreateLocalGameResponse,
} from '../localgame/localgame.typebox';

import { TResetConfirmQuery } from '../2fa/2fa.typebox';

import {
  TUpdateUserProfileRequest,
  TUpdateUserProfileResponse,
} from '../user/user.typebox';

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;
type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;
type UpdateUserProfileRequest = Static<typeof TUpdateUserProfileRequest>;
type UpdateUserProfileResponse = Static<typeof TUpdateUserProfileResponse>;

export { CreateLocalGameRequest, CreateLocalGameResponse, ResetConfirmQuery, UpdateUserProfileRequest, UpdateUserProfileResponse };
