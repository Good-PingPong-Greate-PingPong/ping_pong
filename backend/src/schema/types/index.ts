import { Static } from '@sinclair/typebox'
import { commonGamePagenationSchema } from '../commonSchema'

type TCommonGamePagenation = Static<typeof commonGamePagenationSchema>

export{
	TCommonGamePagenation
}
