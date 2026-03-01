import type { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";
import type { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import type { User } from "../../domain/entities/User.js";
import type { CreateUserDto } from "../../application/dtos/user/UserDtos.js";

export class MysqlUserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: CreateUserDto): Promise<User> {
    const id = randomUUID();
    const createdAt = new Date();

    await this.pool.execute(
      `INSERT INTO users (id, name, email, password, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.email, data.password, createdAt]
    );

    return {
      id,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt,
    };
  }

  async findAll(): Promise<User[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, email, password, created_at as createdAt FROM users`
    );
    return rows;
  }

  async findById(id: string): Promise<User | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, email, password, created_at as createdAt 
       FROM users WHERE id = ?`,
      [id]
    );

    return rows.length ? rows[0] : null;
  }

  /* 🔥 MÉTODO NUEVO PARA LOGIN OPTIMIZADO */
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, email, password, created_at as createdAt 
       FROM users WHERE email = ?`,
      [email]
    );

    return rows.length ? rows[0] : null;
  }

  async update(id: string, data: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    const updated = { ...user, ...data };

    await this.pool.execute(
      `UPDATE users 
       SET name = ?, email = ?, password = ? 
       WHERE id = ?`,
      [updated.name, updated.email, updated.password, id]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
  }
}