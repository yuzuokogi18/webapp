// application/use-cases/auction/GetActiveAuctionUseCase.ts

import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

export class GetActiveAuctionUseCase {
  constructor(private readonly auctionRepo: IAuctionRepository) {}

  async execute(roomId: string): Promise<Auction | null> {
    return await this.auctionRepo.findActiveByRoom(roomId);
  }
}