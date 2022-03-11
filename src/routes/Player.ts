import PlayerModel, {IPlayer} from "../model/PlayerModel";
import express from "express";
import * as jose from "jose";
import {HttpServer} from "../http-server/HttpServer";

export class Player {
    private readonly routers: express.Router;
    private readonly httpServer: HttpServer;

    constructor() {
        this.routers = express.Router();
        this.httpServer = new HttpServer();
        this.httpServer.init();
    }

    get PlayerRoute() {
        this.addPlayerData();
        this.getPlayerData();
        this.updatePlayerData();
        this.deletePlayerData();
        return this.routers;
    }

    addPlayerData() {
        this.routers.route('/add').put(async (req, res) => {
            const playerData = jose.decodeJwt(req.body.playerId as string);
            const player = await PlayerModel.findOne({playerId: playerData._id});
            if (!player) {
                const newPlayer: IPlayer = await PlayerModel.create({
                    playerId: playerData._id,
                    level: req.body.level,
                    score: req.body.score,
                    cybr_coin_amount: req.body.cybr_coin_amount,
                    cybr_coin_per_level: req.body.cybr_coin_per_level,
                    best_time: req.body.best_time,
                })
                await res.status(202).send(
                    {message: "Player data created successfully", playerData: newPlayer}
                );
            } else {
                await res.status(403).send({message: "Error player already exist"});
            }
        });
    }

    getPlayerData() {
        this.routers.route('/get/:id').get(async (req, res) => {
            console.log(req);
            const playerData = jose.decodeJwt(req.params.id as string);
            const player: IPlayer = await PlayerModel.findOne({playerId: playerData._id});
            if (!player) {
                await res.status(404).send({message: "Player not found user addPlayerData endpoint first"});
            } else {
                await res.status(202).send({message: " data retrieve successfully", playerData: player});
            }
        })
    }

    updatePlayerData() {
        this.routers.route("/patch").patch(async (req, res) => {
                const playerData = jose.decodeJwt(req.body.playerId.toString());
                const playerPatch = await PlayerModel.findOne({playerId: playerData._id});
                if (!playerPatch) {
                    await res.status(404).send({message: "Player not found use addPlayerData endpoint first"});
                } else {
                    playerPatch.level = req.body.level;
                    playerPatch.score = req.body.score ;
                    playerPatch.cybr_coin_amount = req.body.cybr_coin_amount ;
                    playerPatch.cybr_coin_per_level = req.body.cybr_coin_per_level ;
                    playerPatch.best_time = req.body.best_time;
                    await playerPatch.save();
                    await res.status(202).send({message: "Update successful", playerData: playerPatch});
                }
            }
        );
    }

    deletePlayerData() {
        this.routers.route('/delete').delete(async (req, res) => {
            try {
                const playerData = jose.decodeJwt(req.query.playerId as string);
                const playerDelete = await PlayerModel.findOneAndDelete({playerId: playerData._id});
                if (!playerDelete) {
                    throw new Error("Cannot delete data from non existing player");
                }
                const testDelete = await PlayerModel.findOne({playerId: playerData.id});
                if (testDelete) {
                    throw new Error("Delete error");
                } else {
                    res.status(200).send({message: " Delete operation successful"});
                }
            } catch (e) {
                return res.status(418).send({message: "Delete error : " + e.message});
            }

        });
    }
}
