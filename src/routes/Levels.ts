import express from 'express'
import {HttpServer} from "../http-server/HttpServer";
import path from "path";

export class Levels {
    private baseUrl: string = "localhost:8072/level/"
    private readonly routers: express.Router;
    private readonly httpServer: HttpServer;

    constructor() {
        this.routers = express.Router();
        this.httpServer = new HttpServer();
        this.httpServer.init();
    }

    get LevelRoute() {
        this.getLevel();
        return this.routers;
    }

    getLevel() {
        this.routers.route("/:id.json").get(async (req, res) => {
            console.log(req.url);
            res.sendFile(path.resolve('./src/levels' + req.url), err => {
                res.send(err);
            });


        })
    }


}