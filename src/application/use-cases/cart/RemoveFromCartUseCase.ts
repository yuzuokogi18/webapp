import type { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class RemoveFromCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(cartItemId: string) {
    return await this.cartRepository.remove(cartItemId);
  }
}
