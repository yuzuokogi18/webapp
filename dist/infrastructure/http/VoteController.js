"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteController = void 0;
const DatabaseConnection_1 = require("../database/DatabaseConnection");
const MysqlVoteRepository_1 = require("../database/MysqlVoteRepository");
class VoteController {
    constructor() {
        this.repo = new MysqlVoteRepository_1.MysqlVoteRepository((0, DatabaseConnection_1.getDatabase)());
        this.vote = async (req, res) => {
            const { userId, productId, value } = req.body;
            const vote = await this.repo.vote({
                userId,
                productId,
                value,
            });
            res.status(201).json(vote);
        };
        this.getByProduct = async (req, res) => {
            const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
            const votes = await this.repo.findByProduct(productId);
            res.json(votes);
        };
    }
}
exports.VoteController = VoteController;
