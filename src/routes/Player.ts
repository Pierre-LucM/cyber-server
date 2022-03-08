import PlayerModel, {IPlayer} from "../model/PlayerModel";
import express from "express";
import * as jose from "jose";

export class Player {
    private readonly routers: express.Router;

    constructor() {
        this.routers = express.Router();
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
            const playerData = jose.decodeJwt(req.query.playerId as string);
            const player = await PlayerModel.findOne({playerId: playerData._id});
            if (!player) {
                const newPlayer: IPlayer = await PlayerModel.create({
                    playerId: playerData._id,
                    level: req.query.level,
                    score: req.query.score,
                    cybr_coin_amount: req.query.cybr_coin_amount,
                    cybr_coin_per_level: req.query.cybr_coin_per_level,
                    best_time: req.query.best_time,
                })

                await res.json({
                    status: 202,
                    data: {message: "Player data created successfully", playerData: newPlayer}
                });
            } else {
                res.json({status: 403, message: "Forbidden user already exist"});
            }
        });
    }

    getPlayerData() {
        this.routers.route('/get/:id').get(async (req, res) => {
            const playerData = jose.decodeJwt(req.query.playerId as string);
            const player: IPlayer = await PlayerModel.findOne({playerId: playerData._id});
            if (!player) {
                res.json({status: 404, message: "Player not found user addPlayerData endpoint first"});
            } else {
                res.json({status: 202, data: {message: " data retrieve successfully", playerData: player}})
            }
        })
    }

    updatePlayerData() {
        this.routers.route("/patch").patch(async (req, res) => {
                const playerData = jose.decodeJwt(req.query.playerId as string);
                const playerPatch = await PlayerModel.findOne({playerId: playerData._id});
                if (!playerPatch) {
                    res.json({status: 404, message: "Player not found user addPlayerData endpoint first"});
                } else {
                    playerPatch.level = req.query.level as string;
                    playerPatch.score = req.query.score as string;
                    playerPatch.cybr_coin_amount = req.query.cybr_coin_amount as string;
                    playerPatch.cybr_coin_per_level = req.query.cybr_coin_per_level as string;
                    playerPatch.best_time = req.query.best_time as string;
                    await playerPatch.save();
                    res.json({status: 202, data: {message: "Update successful", playerData: playerPatch}})
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
                    res.json({status: 200, message: " Delete operation successful"});
                }
            } catch (e) {
                return res.json({status: 400, message: "Delete error : " + e.message});
            }

        });
    }
}
