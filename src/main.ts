import {HttpServer} from "./http-server/HttpServer";
import {Auth} from "./routes/Auth";
import {config} from "dotenv";
import {Player} from "./routes/Player";
import {Levels} from "./routes/Levels";
config()
let httpServer = new HttpServer();
httpServer.init();
httpServer.start(parseInt(process.env.PORT,10)|5000);
httpServer.routes('/auth',new Auth().AuthRoute);
httpServer.routes("/player", new Player().PlayerRoute);
httpServer.routes("/levels", new Levels().LevelRoute);
