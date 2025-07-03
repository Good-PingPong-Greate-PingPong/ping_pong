import { Type } from '@sinclair/typebox';

const TBaseResponse = Type.Object({
  status: Type.Number(),
  success: Type.Boolean(),
  message: Type.String(),
});

//

const TCreateLocalGameRequest = Type.Object({
  user1Nickname: Type.String(),
  user1Score: Type.Number(),
  user2Nickname: Type.String(),
  user2Score: Type.Number(),
});

const TCreateLocalGameResponse = Type.Object({
  status: Type.Number(),
  success: Type.Boolean(),
  message: Type.String(),
});

//

const TReadLocalGameRequest = Type.Object({
  page: Type.Number(),
  offset: Type.Number(),
});

const TResult = Type.Object({
  user1Nickname: Type.String(),
  user2Nickname: Type.String(),
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
  offset: Type.Number(),
});

const TReadLocalGameResponse = Type.Intersect([TBaseResponse, TResults]);

export {
  TCreateLocalGameRequest,
  TCreateLocalGameResponse,
  TReadLocalGameRequest,
  TReadLocalGameResponse,
};
