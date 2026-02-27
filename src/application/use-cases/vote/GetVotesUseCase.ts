import type { IVoteRepository } from "../../../domain/repositories/IVoteRepository";

export class GetVotesUseCase {
  constructor(private voteRepository: IVoteRepository) {}

  async execute(productId: string) {
    return await this.voteRepository.findByProduct(productId);
  }
}
