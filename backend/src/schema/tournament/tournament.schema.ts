import {
  TReadTournamentRequest,
  TReadTournamentResponse,
} from './tournament.typebox';

const readTournamentSchema = {
  queryString: TReadTournamentRequest,
  response: {
    201: TReadTournamentResponse,
  },
};

export { readTournamentSchema };
