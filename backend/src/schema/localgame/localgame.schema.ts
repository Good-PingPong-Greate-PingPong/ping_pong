import {
  TCreateLocalGameRequest,
  TCreateLocalGameResponse,
  TReadLocalGameRequest,
  TReadLocalGameResponse,
} from './localgame.typebox';

const createLocalGameSchema = {
  body: TCreateLocalGameRequest,
  response: {
    201: TCreateLocalGameResponse,
  },
};

const readLocalGameSchema = {
  queryString: TReadLocalGameRequest,
  response: {
    201: TReadLocalGameResponse,
  },
};

export { createLocalGameSchema, readLocalGameSchema };
