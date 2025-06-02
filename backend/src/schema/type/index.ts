import { Static } from '@sinclair/typebox';

import {
  TCreateLocalGameRequest,
  TCreateLocalGameResponse,
  TlistQuery,
  TReadLocalGameRequest,
  TReadLocalGameResponse,
} from '../localgame/localgame.typebox';

import { TResetConfirmQuery } from '../2fa/2fa.typebox';

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;
type ReadLocalGameRequest = Static<typeof TReadLocalGameRequest>;
type ReadLocalGameResponse = Static<typeof TReadLocalGameResponse>;
type ListQuery = Static<typeof TlistQuery>;
type ResetConfirmQuery = Static<typeof TResetConfirmQuery>;

export { 
  CreateLocalGameRequest,
  CreateLocalGameResponse,
  ReadLocalGameRequest,
  ReadLocalGameResponse,
  ResetConfirmQuery
};
