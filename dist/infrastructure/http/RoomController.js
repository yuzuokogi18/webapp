"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const DatabaseConnection_1 = require("../database/DatabaseConnection");
const MysqlRoomRepository_1 = require("../database/MysqlRoomRepository");
class RoomController {
    constructor() {
        this.repo = new MysqlRoomRepository_1.MysqlRoomRepository((0, DatabaseConnection_1.getDatabase)());
        this.create = async (req, res) => {
            const { name, description, createdBy } = req.body;
            const room = await this.repo.create({
                name,
                description,
                createdBy,
            });
            res.status(201).json(room);
        };
        this.getById = async (req, res) => {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const room = await this.repo.findById(id);
            res.json(room);
        };
        this.close = async (req, res) => {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updated = await this.repo.update(id, {});
            res.json(updated);
        };
    }
}
exports.RoomController = RoomController;
