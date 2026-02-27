"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductsUseCase = void 0;
class GetProductsUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(roomId) {
        return await this.productRepository.findByRoomId(roomId);
    }
}
exports.GetProductsUseCase = GetProductsUseCase;
