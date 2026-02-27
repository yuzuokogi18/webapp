"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVotesUseCase = void 0;
class GetVotesUseCase {
    constructor(voteRepository) {
        this.voteRepository = voteRepository;
    }
    async execute(productId) {
        return await this.voteRepository.findByProduct(productId);
    }
}
exports.GetVotesUseCase = GetVotesUseCase;
