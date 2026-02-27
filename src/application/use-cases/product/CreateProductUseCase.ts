import type { CreateProductDto } from "../../dtos/product/ProductDtos";
import type { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductDto) {
    return await this.productRepository.create(data);
  }
}
