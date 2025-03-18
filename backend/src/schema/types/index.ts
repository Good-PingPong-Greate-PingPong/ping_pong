import { Static } from '@synclair/typebox'
import { commonHeaderSchema } from '../commonSchema'
import { localGameBodySchema } from '../localGameSchema'

type TCommonHeader = Static<typeof commonHeaderSchema>

type TlocalGameBody = Static<typeof localGameBodySchema>

export {
    TCommonHeader,
    TlocalGameBody
}