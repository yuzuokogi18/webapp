"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const DatabaseConnection_1 = require("../database/DatabaseConnection");
const MysqlCartRepository_1 = require("../database/MysqlCartRepository");
class CartController {
    constructor() {
        this.repo = new MysqlCartRepository_1.MysqlCartRepository((0, DatabaseConnection_1.getDatabase)());
        this.add = async (req, res) => {
            const { userId, productId, quantity } = req.body;
            const cartItem = await this.repo.add({
                userId,
                productId,
                quantity,
            });
            res.status(201).json(cartItem);
        };
        this.getByUser = async (req, res) => {
            const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
            const cart = await this.repo.findByUser(userId);
            res.json(cart);
        };
        this.remove = async (req, res) => {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            await this.repo.remove(id);
            res.json({ message: "Item removed" });
        };
        this.clear = async (req, res) => {
            const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
            await this.repo.clear(userId);
            res.json({ message: "Cart cleared" });
        };
    }
}
exports.CartController = CartController;
