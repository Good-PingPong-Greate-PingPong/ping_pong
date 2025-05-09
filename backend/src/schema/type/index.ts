import { Static } from '@sinclair/typebox';

import { TCreateLocalGameRequest, TCreateLocalGameResponse } from "../localgame/localgame.typebox";

type CreateLocalGameRequest = Static<typeof TCreateLocalGameRequest>;
type CreateLocalGameResponse = Static<typeof TCreateLocalGameResponse>;

export {
    CreateLocalGameRequest,
    CreateLocalGameResponse
};