import { Type } from "synclair/typebox"
import { commonHeaderSchema, commonQuerySchema, commonPagenationSchema } from "./commonSchema"

const header = commonHeaderSchema
const querystring = commonQuerySchema

const localGameSchema = Type.Object({
    id: Type.Number(),
    nickname1: Type.String(),
    nickname2: Type.String(),
    score1: Type.Number(),
    score2: Type.Number(),
    createdAt: Type.String()
})

const readLocalGamesSchema = {
    header,
    querystring,
    response: {
        200: commonPagenationSchema
    }
}

export{
    localGameSchema,
    readLocalGamesSchema
}