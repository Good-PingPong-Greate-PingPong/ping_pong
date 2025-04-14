import { Type } from '@sinclair/typebox';

const TCreateLocalGameRequest = Type.Object({
    user1_nickname: Type.String(),
    user1_score: Type.Number(),
    user2_nickname: Type.String(),
    user2_score: Type.Number()
});

const TCreateLocalGameResponse = Type.Object({
    status: Type.Number(),
    success: Type.Boolean(),
    message: Type.String()
});

export { TCreateLocalGameRequest, TCreateLocalGameResponse };