"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlCartRepository = void 0;
const crypto_1 = require("crypto");
class MysqlCartRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async add(item) {
        const id = (0, crypto_1.randomUUID)();
        const createdAt = new Date();
        await this.pool.execute(`INSERT INTO cart (id, user_id, product_id, quantity, created_at)
       VALUES (?, ?, ?, ?, ?)`, [id, item.userId, item.productId, item.quantity, createdAt]);
        return {
            id,
            userId: item.userId,
            productId: item.productId,
            quantity: item.quantity,
            createdAt,
        };
    }
    async findByUser(userId) {
        const [rows] = await this.pool.execute(`SELECT id, user_id as userId, product_id as productId, quantity
       FROM cart WHERE user_id = ?`, [userId]);
        return rows;
    }
    async remove(id) {
        await this.pool.execute(`DELETE FROM cart WHERE id = ?`, [id]);
    }
    async clear(userId) {
        await this.pool.execute(`DELETE FROM cart WHERE user_id = ?`, [userId]);
    }
}
exports.MysqlCartRepository = MysqlCartRepository;
