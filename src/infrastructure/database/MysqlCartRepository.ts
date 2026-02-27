import type { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";
import type { ICartRepository } from "../../domain/repositories/ICartRepository.js";
import type { Cart } from "../../domain/entities/Cart.js";
import type { AddToCartDto } from "../../application/dtos/cart/CartDtos.js";

export class MysqlCartRepository implements ICartRepository {
  constructor(private readonly pool: Pool) {}

  async add(item: AddToCartDto): Promise<Cart> {
    const id = randomUUID();
    const createdAt = new Date();
    
    await this.pool.execute(
      `INSERT INTO cart (id, user_id, product_id, quantity, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, item.userId, item.productId, item.quantity, createdAt]
    );
    
    return {
      id,
      userId: item.userId,
      productId: item.productId,
      quantity: item.quantity,
      createdAt,
    };
  }

  async findByUser(userId: string): Promise<Cart[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, user_id as userId, product_id as productId, quantity
       FROM cart WHERE user_id = ?`,
      [userId]
    );
    return rows;
  }

  async remove(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM cart WHERE id = ?`, [id]);
  }

  async clear(userId: string): Promise<void> {
    await this.pool.execute(`DELETE FROM cart WHERE user_id = ?`, [userId]);
  }
}