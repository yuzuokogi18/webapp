"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFromCartUseCase = void 0;
class RemoveFromCartUseCase {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(cartItemId) {
        return await this.cartRepository.remove(cartItemId);
    }
}
exports.RemoveFromCartUseCase = RemoveFromCartUseCase;
