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
  TGetFriendsListRequest,
  TGetFriendsListResponse,
  TModifyFriendRequest,
  TModifyFriendResponse,
} from '../friend/friend.typebox';

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;
type ReadLocalGameResponse = Static<typeof TReadLocalGameResponse>;
type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;
type UpdateUserProfileRequest = Static<typeof TUpdateUserProfileRequest>;
type UpdateUserProfileResponse = Static<typeof TUpdateUserProfileResponse>;
type GetFriendsListRequest = Static<typeof TGetFriendsListRequest>;
type GetFriendsListResponse = Static<typeof TGetFriendsListResponse>;
type ModifyFriendRequest = Static<typeof TModifyFriendRequest>;
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

type GetFriendsListRoute = {
  Querystring: GetFriendsListRequest;
};

type ModifyFriendRoute = {
  Body: ModifyFriendRequest;
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
  GetFriendsListRoute,
  ModifyFriendRoute,
};
