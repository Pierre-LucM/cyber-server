import {Model, Schema} from "mongoose";
import {Database} from "../database/Database";
import {config} from "dotenv";

config();
export const playerSchema: Schema = new Schema<IPlayer>({
    playerId: Schema.Types.String,
    level: Schema.Types.Number,
    score: Schema.Types.Number,
    cybr_coin_amount:Schema.Types.Number,
    cybr_coin_per_level:Schema.Types.Number,
    best_time:Schema.Types.Number
}, {
    collection: 'player'
});

export interface IPlayer {
    playerId: string,
    level: string,
    score: string,
    cybr_coin_amount: string,
    cybr_coin_per_level: Object,
    best_time: string

}

//Add new database collection for user data with this information : userId, level, score, cybr_coin_amount, best_time
const database = new Database(process.env.MONGODB_SERV);
const PlayerModel = database.connection.model("Player", playerSchema) as Model<IPlayer>;

export default PlayerModel;