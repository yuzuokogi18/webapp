import type { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(roomId: string) {
    return await this.productRepository.findByRoomId(roomId);
  }
}
