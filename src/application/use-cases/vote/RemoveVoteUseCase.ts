import type { IVoteRepository } from "../../../domain/repositories/IVoteRepository";

export class RemoveVoteUseCase {
  constructor(private voteRepository: IVoteRepository) {}

  async execute(voteId: string) {
    return await this.voteRepository.delete(voteId);
  }
}
