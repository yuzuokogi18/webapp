import type { UpdateProductDto } from "../../dtos/product/ProductDtos";
import type { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: string, data: UpdateProductDto) {
    return await this.productRepository.update(id, data);
  }
}
