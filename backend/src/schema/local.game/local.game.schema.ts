import { TCreateLocalGameRequest, TCreateLocalGameResponse } from './local.game.typebox'

const createLocalGameSchema = {
    body: TCreateLocalGameRequest,
    response: {
        201: TCreateLocalGameResponse
    }
};

export { createLocalGameSchema }