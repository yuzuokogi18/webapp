import type { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";
import type { IVoteRepository } from "../../domain/repositories/IVoteRepository.js";
import type { Vote } from "../../domain/entities/Vote.js";
import type { CreateVoteDto } from "../../application/dtos/vote/VoteDtos.js";

export class MysqlVoteRepository implements IVoteRepository {
  constructor(private readonly pool: Pool) {}

  async create(vote: Vote): Promise<Vote> {
    await this.pool.execute(
      `INSERT INTO votes (id, user_id, product_id, value, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [vote.id, vote.userId, vote.productId, vote.value, vote.createdAt]
    );
    return vote;
  }

  async vote(data: CreateVoteDto): Promise<Vote> {
    const id = randomUUID();
    const createdAt = new Date();

    await this.pool.execute(
      `INSERT INTO votes (id, user_id, product_id, value, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.userId, data.productId, data.value, createdAt]
    );

    return {
      id,
      userId: data.userId,
      productId: data.productId,
      value: data.value,
      createdAt,
    };
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Vote | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, user_id as userId, product_id as productId, value, created_at as createdAt
       FROM votes WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );
    return rows.length ? rows[0] : null;
  }

  async findByProduct(productId: string): Promise<Vote[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, user_id as userId, product_id as productId, value, created_at as createdAt
       FROM votes WHERE product_id = ?`,
      [productId]
    );
    return rows;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM votes WHERE id = ?`, [id]);
  }
}