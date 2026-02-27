"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlUserRepository = void 0;
const crypto_1 = require("crypto");
class MysqlUserRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        const createdAt = new Date();
        await this.pool.execute(`INSERT INTO users (id, name, email, password, created_at)
       VALUES (?, ?, ?, ?, ?)`, [id, data.name, data.email, data.password, createdAt]);
        return {
            id,
            name: data.name,
            email: data.email,
            password: data.password,
            createdAt,
        };
    }
    async findAll() {
        const [rows] = await this.pool.execute(`SELECT id, name, email, password, created_at as createdAt FROM users`);
        return rows;
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`SELECT id, name, email, password, created_at as createdAt FROM users WHERE id = ?`, [id]);
        return rows.length ? rows[0] : null;
    }
    async update(id, data) {
        const user = await this.findById(id);
        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        const updated = { ...user, ...data };
        await this.pool.execute(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [updated.name, updated.email, updated.password, id]);
        return updated;
    }
    async delete(id) {
        await this.pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
    }
}
exports.MysqlUserRepository = MysqlUserRepository;
