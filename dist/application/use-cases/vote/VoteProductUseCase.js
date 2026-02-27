"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteProductUseCase = void 0;
class VoteProductUseCase {
    constructor(voteRepository) {
        this.voteRepository = voteRepository;
    }
    async execute(data) {
        return await this.voteRepository.vote(data);
    }
}
exports.VoteProductUseCase = VoteProductUseCase;
