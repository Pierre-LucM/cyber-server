import {HttpServer} from "./http-server/HttpServer";
import {Auth} from "./routes/Auth";

let httpServer = new HttpServer();
httpServer.init();
httpServer.start(3000);
httpServer.routes('/test/',new Auth().AuthRoute);
