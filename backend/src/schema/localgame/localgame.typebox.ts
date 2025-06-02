import { Type } from '@sinclair/typebox';

const TBaseResponse = Type.Object({
    status: Type.Number(),
    success: Type.Boolean(),
    message: Type.String()
});

const TBaseQueryString = Type.Object({
    page: Type.Number(),
    offset: Type.Number()
})

//

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

//

const TReadLocalGameRequest = Type.Object({
    TBaseQueryString
})

const TResults = Type.Object({
    data: Type.Object({
        total_page: Type.Number(),
        current_page: Type.Number(),
        records: Type.Array(
            Type.Object({
                id: Type.Number(),
                userId: Type.Number(),
                user1Nickname: Type.String(),
                user1Score: Type.Number(),
                user2Nickname: Type.String(),
                user2Score: Type.Number(),
                createdAt: Type.String()
            })
        )
    })
});

const TlistQuery = Type.Object({
    page: Type.Number(),
    offset: Type.Number()
});

const TReadLocalGameResponse = Type.Intersect([
    TBaseResponse,
    TResults
]);

export { 
    TCreateLocalGameRequest,
    TCreateLocalGameResponse,
    TReadLocalGameRequest,
    TReadLocalGameResponse,
    TlistQuery
};