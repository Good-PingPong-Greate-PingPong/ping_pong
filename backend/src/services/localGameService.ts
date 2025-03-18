import db from '../lib/db'
import { getCurrentDate } from '../lib/timeHelper'
import { ERROR_MESSAGE } from '../lib/constants'

function localGameService() {
    const createLocalGame = async (id:number, user1_nick:string, user2_nick:string, user1_score:number, user2_score:number) => {
        try {
            const values = {
                user1_nickname: user1_nick,
                user2_nickname: user2_nick,
                user1_score: user1_score,
                user2_score: user2_score,
                user1Id: id,
                createdAt: getCurrentDate()
            }

            const result = await db.localGames.create({
                data:values
            })
            return "success"
        }
        catch (error){
            throw error
        }
    }

    return {
        createLocalGame
    }
}

export default localGameService()