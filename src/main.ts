import {HttpServer} from "./http-server/HttpServer";
import {Auth} from "./routes/Auth";
import {Database} from "./database/Database";
import {config} from "dotenv";
import {Player} from "./routes/Player";
config()
let httpServer = new HttpServer();
httpServer.init();
httpServer.start(3000);
console.log(new Auth().AuthRoute)
const test = async()=> {
    console.log(await new Database(process.env.MONGODB_SERV))
}
//httpServer.app.use("/auth",new Auth().AuthRoute)
httpServer.routes('/auth',new Auth().AuthRoute);
httpServer.routes("/player", new Player().PlayerRoute);