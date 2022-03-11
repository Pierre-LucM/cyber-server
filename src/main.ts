import {HttpServer} from "./http-server/HttpServer";
import {Auth} from "./routes/Auth";
import {config} from "dotenv";
import {Player} from "./routes/Player";
config()
let httpServer = new HttpServer();
httpServer.init();
httpServer.start(parseInt(process.env.PORT,10)|5000);
httpServer.routes('/auth',new Auth().AuthRoute);
httpServer.routes("/player", new Player().PlayerRoute);
