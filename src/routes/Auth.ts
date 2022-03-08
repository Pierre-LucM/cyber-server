import express from "express";
import AuthModel from "../model/AuthModel";
import authModel, {IAuth} from "../model/AuthModel";
import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import * as jose from "jose";
import {KeyLike} from "jose";
import {HydratedDocument} from "mongoose";

export class Auth {
    private readonly routers: express.Router;
    private jwtPrivateKey: KeyLike;

    constructor() {
        this.routers = express.Router();
        this.loadKey();
    }

    get AuthRoute(): express.Router {
        this.register();
        this.login();
        return this.routers;
    }

    register() {

        //add password and hash
        this.routers.route('/register').post(async (req, res) => {
            const databaseUser = await AuthModel.findOne({mail: req.query.mail})
            if (databaseUser != null) {
                res.json({status: 403, message: "user already exist"});
            } else {
                const newUser = await authModel.create({
                    mail: req.query.mail,
                    name: req.query.name,
                    password: undefined
                })
                const salt = genSaltSync(10);
                newUser.password = hashSync(req.query.password, salt);
                await newUser.save();
                console.log(newUser);
                if (newUser != null) {

                    res.json({
                        status: 200, message: {
                            user: newUser,
                            token: await this.createUserToken(newUser)
                        }
                    });
                }
            }
        });
    }

    login() {
        this.routers.route("/login").post(async (req, res) => {
            const databaseUser = await AuthModel.findOne({mail: req.query.mail})
            if (databaseUser == null) {
                res.json({status: 404, message: "user not found please create account to continue"});
            } else {
                if (!compareSync(req.query.password, databaseUser.password)) {
                    throw new Error('Invalid password');
                }

                res.json({
                    status: 200, message: {
                        user: databaseUser,
                        token: await this.createUserToken(databaseUser)
                    }
                });// send level information after send to the server
            }
        })
    }

    async createUserToken(user: HydratedDocument<IAuth>) {
        const token = await new jose.SignJWT({
            _id: user._id,
            name: user.name,
            mail: user.mail,
        }).setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .setIssuer('urn:cybr:issuer')
            .setAudience('urn:cybr:audience')
            .setExpirationTime('2y')
            .sign(this.jwtPrivateKey);
        return token;
    }

    async loadKey() {
        this.jwtPrivateKey = await jose.importJWK({
            kty: 'oct',
            k: process.env.JWT_SECRET as string
        }, 'HS256') as KeyLike;
    }
}