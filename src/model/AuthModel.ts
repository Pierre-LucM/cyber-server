import {Model,Schema} from "mongoose";
import {Database} from "../database/Database";
import {config} from "dotenv";
config();
export const authSchema:Schema= new Schema<IAuth>({
    name:Schema.Types.String,
    mail:Schema.Types.String,
},{
    collection: 'users'
});
export interface IAuth{
    name:string,
    mail:string,
}

const database = new Database(process.env.MONGODB_SERV);
const AuthModel = database.connection.model("Auth",authSchema) as Model<IAuth>;

export default AuthModel;