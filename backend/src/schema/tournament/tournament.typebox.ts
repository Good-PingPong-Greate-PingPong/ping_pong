import { Type } from '@sinclair/typebox';

const TBaseResponse = Type.Object({
  status: Type.Number(),
  success: Type.Boolean(),
  message: Type.String(),
});

//

const TReadTournamentRequest = Type.Object({
  page: Type.Number(),
});

const TResult = Type.Object({
  user1Nickname: Type.String(),
  user2Nickname: Type.String(),
  user1Image: Type.String(),
  user2Image: Type.String(),
  user1Score: Type.Number(),
  user2Score: Type.Number(),
  createdAt: Type.String(),
});

const TResults = Type.Object({
  data: Type.Object({
    totalPage: Type.Number(),
    currentPage: Type.Number(),
    records: Type.Array(TResult),
  }),
});

const TListQuery = Type.Object({
  page: Type.Number(),
});

const TReadTournamentResponse = Type.Intersect([TBaseResponse, TResults]);

export { TReadTournamentRequest, TReadTournamentResponse };
