"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlRoomRepository = void 0;
const crypto_1 = require("crypto");
class MysqlRoomRepository {
    constructor(pool) {
        this.pool = pool;
    }
    async create(data) {
        const id = (0, crypto_1.randomUUID)();
        const createdAt = new Date();
        const isActive = true;
        const participants = [];
        await this.pool.execute(`INSERT INTO rooms (id, name, description, created_by, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`, [id, data.name, data.description, data.createdBy, isActive, createdAt]);
        return {
            id,
            name: data.name,
            description: data.description,
            createdBy: data.createdBy,
            isActive,
            participants,
            createdAt,
        };
    }
    async findById(id) {
        const [rows] = await this.pool.execute(`SELECT id, name, description, created_by as createdBy, is_active as isActive, created_at as createdAt
       FROM rooms WHERE id = ?`, [id]);
        if (!rows.length)
            return null;
        const room = rows[0];
        const participants = await this.getParticipants(id);
        return { ...room, participants };
    }
    async findAll() {
        const [rows] = await this.pool.execute(`SELECT id, name, description, created_by as createdBy, is_active as isActive, created_at as createdAt FROM rooms`);
        return Promise.all(rows.map(async (room) => ({
            ...room,
            participants: await this.getParticipants(room.id),
        })));
    }
    async update(id, data) {
        const room = await this.findById(id);
        if (!room) {
            throw new Error(`Room with id ${id} not found`);
        }
        const updated = { ...room, ...data };
        await this.pool.execute(`UPDATE rooms SET name = ?, description = ? WHERE id = ?`, [updated.name, updated.description, id]);
        return updated;
    }
    async delete(id) {
        await this.pool.execute(`DELETE FROM rooms WHERE id = ?`, [id]);
    }
    async join(roomId, userId) {
        const room = await this.findById(roomId);
        if (!room) {
            throw new Error(`Room with id ${roomId} not found`);
        }
        // Add participant to room_participants table
        await this.pool.execute(`INSERT IGNORE INTO room_participants (room_id, user_id) VALUES (?, ?)`, [roomId, userId]);
        return { ...room, participants: [...room.participants, userId] };
    }
    async leave(roomId, userId) {
        const room = await this.findById(roomId);
        if (!room) {
            throw new Error(`Room with id ${roomId} not found`);
        }
        // Remove participant from room_participants table
        await this.pool.execute(`DELETE FROM room_participants WHERE room_id = ? AND user_id = ?`, [roomId, userId]);
        return {
            ...room,
            participants: room.participants.filter((id) => id !== userId),
        };
    }
    async getParticipants(roomId) {
        const [rows] = await this.pool.execute(`SELECT user_id as userId FROM room_participants WHERE room_id = ?`, [roomId]);
        return rows.map((row) => row.userId);
    }
}
exports.MysqlRoomRepository = MysqlRoomRepository;
