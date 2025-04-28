import { TCreateLocalGameRequest, TCreateLocalGameResponse } from './localgame.typebox'

const createLocalGameSchema = {
    body: TCreateLocalGameRequest,
    response: {
        201: TCreateLocalGameResponse
    }
};

export { createLocalGameSchema }