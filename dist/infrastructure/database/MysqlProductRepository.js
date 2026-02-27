"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlProductRepository = void 0;
const crypto_1 = require("crypto");
class MysqlProductRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        const createdAt = new Date();
        const imageUrl = "";
        await this.pool.execute(`INSERT INTO products (id, name, price, stock, room_id, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, data.name, data.price, data.stock, data.roomId, imageUrl, createdAt]);
        return {
            id,
            name: data.name,
            price: data.price,
            stock: data.stock,
            roomId: data.roomId,
            imageUrl,
            createdAt,
        };
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`SELECT id, name, price, stock, room_id as roomId, image_url as imageUrl, created_at as createdAt FROM products WHERE id = ?`, [id]);
        return rows.length ? rows[0] : null;
    }
    async findAll() {
        const [rows] = await this.pool.execute(`SELECT id, name, price, stock, room_id as roomId, image_url as imageUrl, created_at as createdAt FROM products`);
        return rows;
    }
    async findByRoomId(roomId) {
        const [rows] = await this.pool.execute(`SELECT id, name, price, stock, room_id as roomId, image_url as imageUrl, created_at as createdAt FROM products WHERE room_id = ?`, [roomId]);
        return rows;
    }
    async update(id, data) {
        const product = await this.findById(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        const updated = { ...product, ...data };
        await this.pool.execute(`UPDATE products SET name = ?, price = ?, stock = ?, image_url = ? WHERE id = ?`, [updated.name, updated.price, updated.stock, updated.imageUrl, id]);
        return updated;
    }
    async delete(id) {
        await this.pool.execute(`DELETE FROM products WHERE id = ?`, [id]);
    }
}
exports.MysqlProductRepository = MysqlProductRepository;
