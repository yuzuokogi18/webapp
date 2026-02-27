import { randomUUID } from "crypto";
import type { Pool } from "mysql2/promise";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import type { Product } from "../../domain/entities/Product";
import type { CreateProductDto } from "../../application/dtos/product/ProductDtos";

export class MysqlProductRepository implements IProductRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: CreateProductDto): Promise<Product> {
    const id = randomUUID();
    const createdAt = new Date();
    const imageUrl = "";
    
    await this.pool.execute(
      `INSERT INTO products (id, name, price, stock, room_id, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.price, data.stock, data.roomId, imageUrl, createdAt]
    );
    
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

  async findById(id: string): Promise<Product | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, price, stock, room_id as roomId, image_url as imageUrl, created_at as createdAt FROM products WHERE id = ?`,
      [id]
    );
    return rows.length ? rows[0] : null;
  }

  async findAll(): Promise<Product[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, price, stock, room_id as roomId, image_url as imageUrl, created_at as createdAt FROM products`
    );
    return rows;
  }

  async findByRoomId(roomId: string): Promise<Product[]> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT id, name, price, stock, room_id as roomId, image_url as imageUrl, created_at as createdAt FROM products WHERE room_id = ?`,
      [roomId]
    );
    return rows;
  }

  async update(id: string, data: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updated = { ...product, ...data };

    await this.pool.execute(
      `UPDATE products SET name = ?, price = ?, stock = ?, image_url = ? WHERE id = ?`,
      [updated.name, updated.price, updated.stock, updated.imageUrl, id]
    );

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute(`DELETE FROM products WHERE id = ?`, [id]);
  }
}
