"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const DatabaseConnection_1 = require("../database/DatabaseConnection");
const MysqlProductRepository_1 = require("../database/MysqlProductRepository");
class ProductController {
    constructor() {
        this.repo = new MysqlProductRepository_1.MysqlProductRepository((0, DatabaseConnection_1.getDatabase)());
        this.create = async (req, res) => {
            const { name, price, stock, roomId } = req.body;
            const product = await this.repo.create({
                name,
                price,
                stock,
                roomId,
            });
            res.status(201).json(product);
        };
        this.getAll = async (_, res) => {
            const products = await this.repo.findAll();
            res.json(products);
        };
        this.update = async (req, res) => {
            const { name, price, stock } = req.body;
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updated = await this.repo.update(id, {
                name,
                price,
                stock,
            });
            res.json(updated);
        };
        this.delete = async (req, res) => {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            await this.repo.delete(id);
            res.json({ message: "Product deleted" });
        };
    }
}
exports.ProductController = ProductController;
