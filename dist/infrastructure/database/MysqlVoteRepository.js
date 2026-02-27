"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlVoteRepository = void 0;
const crypto_1 = require("crypto");
class MysqlVoteRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(vote) {
        await this.pool.execute(`INSERT INTO votes (id, user_id, product_id, value, created_at)
       VALUES (?, ?, ?, ?, ?)`, [vote.id, vote.userId, vote.productId, vote.value, vote.createdAt]);
        return vote;
    }
    async vote(data) {
        const id = (0, crypto_1.randomUUID)();
        const createdAt = new Date();
        await this.pool.execute(`INSERT INTO votes (id, user_id, product_id, value, created_at)
       VALUES (?, ?, ?, ?, ?)`, [id, data.userId, data.productId, data.value, createdAt]);
        return {
            id,
            userId: data.userId,
            productId: data.productId,
            value: data.value,
            createdAt,
        };
    }
    async findByUserAndProduct(userId, productId) {
        const [rows] = await this.pool.execute(`SELECT id, user_id as userId, product_id as productId, value, created_at as createdAt
       FROM votes WHERE user_id = ? AND product_id = ?`, [userId, productId]);
        return rows.length ? rows[0] : null;
    }
    async findByProduct(productId) {
        const [rows] = await this.pool.execute(`SELECT id, user_id as userId, product_id as productId, value, created_at as createdAt
       FROM votes WHERE product_id = ?`, [productId]);
        return rows;
    }
    async delete(id) {
        await this.pool.execute(`DELETE FROM votes WHERE id = ?`, [id]);
    }
}
exports.MysqlVoteRepository = MysqlVoteRepository;
