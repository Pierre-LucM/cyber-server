import express from "express";
import cors from "cors";

export class HttpServer{
    public readonly app:express.Express;

    constructor(){
        this.app = express();

    }
    init():void{
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false
        }));
        this.app.use(cors());
    }
    routes(pathRoute:string,routingModule:express.Router):void{
        this.app.use(pathRoute,routingModule);
    }
    start(port:number):void{
        this.app.listen(port,()=>{
            console.log("server listen on localhost:"+port);
        });
    }
    get App():express.Express{
        return this.app;
    }
}