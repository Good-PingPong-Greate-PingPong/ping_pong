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

import {
  TGetfriendListRequest,
  TGetfriendListResponse,
  TAddFriendRequest,
  TRemoveFriendRequest,
  TModifyFriendResponse,
} from '../friend/friend.typebox';

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;
type ReadLocalGameResponse = Static<typeof TReadLocalGameResponse>;
type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;
type UpdateUserProfileRequest = Static<typeof TUpdateUserProfileRequest>;
type UpdateUserProfileResponse = Static<typeof TUpdateUserProfileResponse>;
type GetfriendListRequest = Static<typeof TGetfriendListRequest>;
type GetfriendListResponse = Static<typeof TGetfriendListResponse>;
type addFriendRequest = Static<typeof TAddFriendRequest>;
type removeFriendRequest = Static<typeof TRemoveFriendRequest>;
type ModifyFriendResponse = Static<typeof TModifyFriendResponse>;

type CreateLocalGameRoute = {
  Body: CreateLocalGameRequest;
};

type ListQueryRoute = {
  Querystring: {
    page: number;
    offset: number;
  };
};

type GetfriendListRoute = {
  Querystring: GetfriendListRequest;
};

type addFriendRoute = {
  Querystring: addFriendRequest;
};

type removeFriendRoute = {
  Body: removeFriendRequest;
};

export {
  CreateLocalGameRequest,
  CreateLocalGameResponse,
  ReadLocalGameResponse,
  ResetConfirmQuery,
  CreateLocalGameRoute,
  ListQueryRoute,
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
  GetfriendListRoute,
  addFriendRoute,
  removeFriendRoute,
};
