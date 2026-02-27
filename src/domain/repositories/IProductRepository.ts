import type { Product } from "../entities/Product";
import type { CreateProductDto } from "../../application/dtos/product/ProductDtos";

export interface IProductRepository {
  create(data: CreateProductDto): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByRoomId(roomId: string): Promise<Product[]>;
  update(id: string, data: Partial<CreateProductDto>): Promise<Product>;
  delete(id: string): Promise<void>;
}
