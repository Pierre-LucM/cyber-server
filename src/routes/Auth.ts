import express from  "express";
import {IRoute} from "express";
import {Application} from "express-serve-static-core";
import AuthModel, {IAuth} from "../model/AuthModel";
import authModel from "../model/AuthModel";

export class Auth {
    private readonly routers: express.Router;

    constructor() {
        this.routers = express.Router();
    }

    get AuthRoute(): express.Router {
       this.register();
        return this.routers;
    }
    register(){
        this.routers.route('/register').post(async (req,res)=>{
            const databaseUser = await AuthModel.findOne({mail:req.query.mail})
            if(databaseUser!=null){
                res.json({status:403, message:"user already exist"});
            }else {
                const newUser = await authModel.create({mail: req.query.mail, name: req.query.name})
                console.log(newUser);
                if(newUser!=null){
                    res.json({status:200,message:" user account created successfully"})
                }
            }
        })
    }
}