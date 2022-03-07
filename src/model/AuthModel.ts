import {Model,Schema} from "mongoose";

export const authModel:Schema= new Schema<IAuth>({
    name:Schema.Types.String,
    mail:Schema.Types.String,
});
export interface IAuth{
    name:string,
    mail:string,
}