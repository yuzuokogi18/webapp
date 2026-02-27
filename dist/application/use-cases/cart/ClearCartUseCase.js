"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearCartUseCase = void 0;
class ClearCartUseCase {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async execute(userId) {
        return await this.cartRepository.clear(userId);
    }
}
exports.ClearCartUseCase = ClearCartUseCase;
