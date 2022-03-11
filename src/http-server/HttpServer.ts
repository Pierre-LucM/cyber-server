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
        this.app.use(cookieParser());
        this.app.use((req,res,next)=>{
            // site que je veux autoriser à se connecter
            res.setHeader('Access-Control-Allow-Origin', '*');

            // méthodes de connexion autorisées
            res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST','PATCH','DELETE','PUT']);

            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            next();
        })
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