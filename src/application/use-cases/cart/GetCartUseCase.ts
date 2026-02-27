import type { ICartRepository } from "../../../domain/repositories/ICartRepository";

export class GetCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(userId: string) {
    return await this.cartRepository.findByUser(userId);
  }
}
