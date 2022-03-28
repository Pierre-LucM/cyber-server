import express from "express";
import AuthModel from "../model/AuthModel";
import authModel, {IAuth} from "../model/AuthModel";
import {compareSync, genSaltSync, hashSync} from 'bcryptjs';
import * as jose from "jose";
import {KeyLike} from "jose";
import {HydratedDocument} from "mongoose";
import {body, validationResult} from "express-validator";

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
        this.logout();
        return this.routers;
    }

    register() {
        this.routers.route('/register').post(body('mail').isEmail(), body('password').isStrongPassword({minLength: 6}), async (req, res) => {
            console.log(req.body);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const databaseUser = await AuthModel.findOne({mail: req.body.mail})
            if (databaseUser != null) {
                res.status(403).send({message: "user already exist"});
            } else {
                const newUser = await authModel.create({
                    mail: req.body.mail,
                    name: req.body.name,
                    password: undefined,
                    _id: undefined,
                })
                const salt = genSaltSync(10);
                newUser.password = await hashSync(req.body.password, salt);
                await newUser.save();
                console.log(newUser);
                if (newUser != null) {

                    const JWToken = await this.createUserToken(newUser);
                    let cookie = req.cookies.token;
                    let options = {
                        maxAge: 1000 * 60 * 60 * 24, // would expire after 1 day
                        httpOnly: true, // The cookie only accessible by the web server
                    }
                    if (!cookie) {
                        //create new cookie
                        res.cookie("token", JWToken, options);
                    }
                    res.status(200).send({
                        message: {
                            user: newUser,
                            token: JWToken
                        }
                    });
                }
            }
        });
    }

    login() {
        this.routers.route("/login").post(body('mail').isEmail(), body('password').isStrongPassword({minLength: 6}), async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            const databaseUser = await AuthModel.findOne({mail: req.body.mail})
            if (databaseUser == null) {
                res.status(404).send({message: "user not found please create account to continue"});
            } else {
                if (!compareSync(req.body.password, databaseUser.password)) {
                    throw new Error('Invalid password');
                }
                const JWToken = await this.createUserToken(databaseUser);
                let cookie = req.cookies.token;
                let options = {
                    maxAge: 1000 * 60 * 60 * 24, // would expire after 1 day
                    httpOnly: true, // The cookie only accessible by the web server
                }
                if (cookie == '') {
                    //create new cookie
                    res.cookie("token", JWToken);
                }
                res.status(200).send({
                    message: {
                        user: databaseUser,
                        token: JWToken
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

    logout() {
        this.routers.route("/logout").delete(async (req, res) => {
                console.log(req);
                let jwtVerifyResult: jose.JWTVerifyResult;
                try {
                    jwtVerifyResult = await jose.jwtVerify(req.cookies.token as string, this.jwtPrivateKey, {
                        issuer: 'urn:cybr:issuer',
                        audience: 'urn:cybr:audience'
                    });
                    console.log(jwtVerifyResult);
                    if (jwtVerifyResult == undefined) {
                        res.status(403).send({message: "Forbidden"})
                    } else {
                        console.log(res.clearCookie("token"))
                        res.status(202).send({message: "logout successful"});
                    }
                } catch (e) {
                    res.status(403).send({message: {success: false, error: `JWT Decode failed ${e.message}`}});
                    return;
                }
            }
        );
    }
}