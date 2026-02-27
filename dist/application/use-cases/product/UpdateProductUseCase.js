"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductUseCase = void 0;
class UpdateProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id, data) {
        return await this.productRepository.update(id, data);
    }
}
exports.UpdateProductUseCase = UpdateProductUseCase;
