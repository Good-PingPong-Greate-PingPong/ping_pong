import { TCommonPagenation, TLocalGame } from "../schema/types";
import { CATEGORY_TYPE } from "../lib/constants";

const readLocalGamesSchema = async (pageNumber: number, mode: string, userId?: number) => {
    const pageSize = 4 //pageSize??????
    let skip = 0

    if (pageNumber > 1)
            skip = ((pageNumber - 1) * pageSize)

    let _where = {}

    if (mode === CATEGORY_TYPE.MY) {
        _where = {userId: userId}
    }

    try {
        const localGames = await db.localGame.findMany({
            where: _where,
            include: {
                user: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            },
            skip: skip,
            take: pageSize
        })

        const totalLocalGameCount = await db.localGame.count({
            where: _where
        })

        let totalPageCount = Math.ceil(totalLocalGameCount / pageSize)

        let flattenLocalGames:TLocalGame[] = localGames.map(localGame => {
            return {
                ...localGame,
                createdAt: localGame.createdAt.toString()
            }
        })

        const returnValue:TCommonPagenation = {
            totalPageCount: totalPageCount,
            localGameList: localGames
        }

        return returnValue
    }
    catch (error) {
        throw error
    }
}