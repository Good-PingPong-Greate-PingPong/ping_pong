import { TCreateLocalGameRequest, TCreateLocalGameResponse, TlistQuery, TReadLocalGameRequest, TReadLocalGameResponse } from './localgame.typebox'

const createLocalGameSchema = {
    body: TCreateLocalGameRequest,
    response: {
        201: TCreateLocalGameResponse
    }
};

const readLocalGameSchema = {
    queryString: TReadLocalGameRequest,
    response: {
        201: TReadLocalGameResponse
    }
}

type listQuerySchema = {
    page: number,
    offset: number
};

export { 
    createLocalGameSchema,
    readLocalGameSchema,
    listQuerySchema
}