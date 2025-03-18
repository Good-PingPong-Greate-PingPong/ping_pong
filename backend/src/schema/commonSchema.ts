import { Type } from '@sinclair/typebox'

const commonHeaderSchema = Type.Object({
    authorization: Type.Optional(Type.String())
})

export {
    commonHeaderSchema
}