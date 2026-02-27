"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveVoteUseCase = void 0;
class RemoveVoteUseCase {
    constructor(voteRepository) {
        this.voteRepository = voteRepository;
    }
    async execute(voteId) {
        return await this.voteRepository.delete(voteId);
    }
}
exports.RemoveVoteUseCase = RemoveVoteUseCase;
