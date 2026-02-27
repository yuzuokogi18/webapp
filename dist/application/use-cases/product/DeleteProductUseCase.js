"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductUseCase = void 0;
class DeleteProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        return await this.productRepository.delete(id);
    }
}
exports.DeleteProductUseCase = DeleteProductUseCase;
