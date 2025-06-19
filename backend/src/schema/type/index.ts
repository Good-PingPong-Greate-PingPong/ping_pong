import { Static } from '@sinclair/typebox';

import {
  TCreateLocalGameRequest,
  TCreateLocalGameResponse,
} from '../localgame/localgame.typebox';

import { TResetConfirmQuery } from '../2fa/2fa.typebox';

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;
type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;

type ListQueryRoute = {
  Querystring: {
    page: number;
    offset: number;
  };
};

export {
  CreateLocalGameRequest,
  CreateLocalGameResponse,
  ResetConfirmQuery,
  ListQueryRoute,
};
