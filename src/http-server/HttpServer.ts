import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
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
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
        })
        this.app.use(cookieParser());
    }
    routes(pathRoute:string,routingModule:express.Router):void{
        this.app.use(pathRoute,routingModule);
    }
    start(port:number):void{
        this.app.listen(port,()=>{
            console.log("server listen on PORT : "+port);
        });
    }
    get App():express.Express{
        return this.app;
    }
}