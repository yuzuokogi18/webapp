import type { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class ClearCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string) {
    return await this.cartRepository.clear(userId);
  }
}
