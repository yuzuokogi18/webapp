import type { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";
import type { IRoomRepository } from "../../domain/repositories/IRoomRepository.js";
import type { Room } from "../../domain/entities/Room.js";
import type { CreateRoomDto } from "../../application/dtos/room/RoomDtos.js";

export class MysqlRoomRepository implements IRoomRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: CreateRoomDto): Promise<Room> {
    const id = randomUUID();
    const createdAt = new Date();
    const isActive = true;
    const participants: string[] = [];

    await this.pool.execute(
      `INSERT INTO rooms (id, name, description, created_by, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.description, data.createdBy, isActive, createdAt]
    );

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

  async findById(id: string): Promise<Room | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, description, created_by as createdBy, is_active as isActive, created_at as createdAt
       FROM rooms WHERE id = ?`,
      [id]
    );

    if (!rows.length) return null;

    const room = rows[0];
    const participants = await this.getParticipants(id);

    return { ...room, participants };
  }

  async findAll(): Promise<Room[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, description, created_by as createdBy, is_active as isActive, created_at as createdAt FROM rooms`
    );

    return Promise.all(
      rows.map(async (room: any) => ({
        ...room,
        participants: await this.getParticipants(room.id),
      }))
    );
  }

  async update(id: string, data: Partial<CreateRoomDto>): Promise<Room> {
    const room = await this.findById(id);
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }

    const updated = { ...room, ...data };

    await this.pool.execute(
      `UPDATE rooms SET name = ?, description = ? WHERE id = ?`,
      [updated.name, updated.description, id]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM rooms WHERE id = ?`, [id]);
  }

  async join(roomId: string, userId: string): Promise<Room> {
    const room = await this.findById(roomId);
    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    // Add participant to room_participants table
    await this.pool.execute(
      `INSERT IGNORE INTO room_participants (room_id, user_id) VALUES (?, ?)`,
      [roomId, userId]
    );

    return { ...room, participants: [...room.participants, userId] };
  }

  async leave(roomId: string, userId: string): Promise<Room> {
    const room = await this.findById(roomId);
    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    // Remove participant from room_participants table
    await this.pool.execute(
      `DELETE FROM room_participants WHERE room_id = ? AND user_id = ?`,
      [roomId, userId]
    );

    return {
      ...room,
      participants: room.participants.filter((id) => id !== userId),
    };
  }

  private async getParticipants(roomId: string): Promise<string[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT user_id as userId FROM room_participants WHERE room_id = ?`,
      [roomId]
    );
    return rows.map((row: any) => row.userId);
  }
}