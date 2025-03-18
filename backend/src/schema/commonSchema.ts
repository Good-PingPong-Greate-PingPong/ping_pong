import { Type } "@sinclair/typebox"

const GameHistorySchema = Type.Object({
	nickname1: Type.String(),
	nickname2: Type.String(),
	score1: Type.Number(),
	score2: Type.Number(),
	createdAt: Type.String()
})

const commonGamePagenationSchema = Type.Object({
	totalPageCount: Type.Number(),
	current_page: Type.Number(),
	localGameList: Type.Array(GameHistorySchema)
})

export {
	commonGamePagenationSchema
}