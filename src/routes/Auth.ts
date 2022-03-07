import express from  "express";
import {IRoute} from "express";
import {Application} from "express-serve-static-core";

export class Auth {
    private readonly routers:express.Router;
    constructor() {
        this.routers = express.Router();
    }

    get AuthRoute():express.Router{
        return this.routers;
    }
    private request(){
        this.AuthRoute.route("/auth").post((req,res)=>{

        })
    }
}