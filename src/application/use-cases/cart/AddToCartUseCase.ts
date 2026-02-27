import type { AddToCartDto } from "../../dtos/cart/CartDtos";
import type { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class AddToCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(data: AddToCartDto) {
    return await this.cartRepository.add(data);
  }
}
