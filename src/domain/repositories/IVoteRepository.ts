import type { Vote } from "../entities/Vote";
import type { CreateVoteDto } from "../../application/dtos/vote/VoteDtos";

export interface IVoteRepository {
  create(vote: Vote): Promise<Vote>;
  vote(data: CreateVoteDto): Promise<Vote>;
  findByUserAndProduct(userId: string, productId: string): Promise<Vote | null>;
  findByProduct(productId: string): Promise<Vote[]>;
  delete(id: string): Promise<void>;
}
