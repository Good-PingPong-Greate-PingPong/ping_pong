import { Type } from '@sinclair/typebox'
import { commonHeaderSchema } from './commonSchema'

const header = commonHeaderSchema

const localGameBodySchema = Type.Object({
    user1_nickname: Type.String(),
    user2_nickname: Type.String(),
    user1_score: Type.Number(),
    user2_score: Type.Number()
})

const createLocalGameSchema = {
    header,
    body: Type.Object({
        user1_nickname: Type.String(),
        user2_nickname: Type.String(),
        user1_score: Type.Number(),
        user2_score: Type.Number()
    }),
    response: {
        200: "success"
    }
}

export {
    localGameBodySchema
    createLocalGameSchema
}