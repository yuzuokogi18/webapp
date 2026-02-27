import type { CreateVoteDto } from "../../dtos/vote/VoteDtos";
import type { IVoteRepository } from "../../../domain/repositories/IVoteRepository";

export class VoteProductUseCase {
  constructor(private voteRepository: IVoteRepository) {}

  async execute(data: CreateVoteDto) {
    return await this.voteRepository.vote(data);
  }
}
