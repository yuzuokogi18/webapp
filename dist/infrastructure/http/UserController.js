"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const DatabaseConnection_1 = require("../database/DatabaseConnection");
const MysqlUserRepository_1 = require("../database/MysqlUserRepository");
class UserController {
    constructor() {
        this.repo = new MysqlUserRepository_1.MysqlUserRepository((0, DatabaseConnection_1.getDatabase)());
        this.create = async (req, res) => {
            const { name, email, password } = req.body;
            const user = await this.repo.create({
                name,
                email,
                password,
            });
            res.status(201).json(user);
        };
        this.getAll = async (_, res) => {
            const users = await this.repo.findAll();
            res.json(users);
        };
        this.update = async (req, res) => {
            const { name, email, password } = req.body;
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updated = await this.repo.update(id, {
                name,
                email,
                password,
            });
            res.json(updated);
        };
        this.delete = async (req, res) => {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            await this.repo.delete(id);
            res.json({ message: "User deleted" });
        };
    }
}
exports.UserController = UserController;
