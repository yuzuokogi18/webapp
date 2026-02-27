"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCartUseCase = void 0;
class AddToCartUseCase {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(data) {
        return await this.cartRepository.add(data);
    }
}
exports.AddToCartUseCase = AddToCartUseCase;
