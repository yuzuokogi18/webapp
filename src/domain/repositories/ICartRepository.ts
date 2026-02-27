import type { Cart } from "../entities/Cart";
import type { AddToCartDto } from "../../application/dtos/cart/CartDtos";

export interface ICartRepository {
  add(item: AddToCartDto): Promise<Cart>;
  findByUser(userId: string): Promise<Cart[]>;
  remove(id: string): Promise<void>;
  clear(userId: string): Promise<void>;
}
