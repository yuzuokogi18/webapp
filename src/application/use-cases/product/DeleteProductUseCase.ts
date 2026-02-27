import type { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string) {
    return await this.productRepository.delete(id);
  }
}
