// application/use-cases/auction/CloseAuctionUseCase.ts

import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

export class CloseAuctionUseCase {
  constructor(private readonly auctionRepo: IAuctionRepository) {}

  async execute(
    roomId: string,
    userId: string
  ): Promise<Auction> {

    const auction = await this.auctionRepo.findActiveByRoom(roomId);

    if (!auction) {
      throw new Error("No active auction found");
    }

    if (auction.hostId !== userId) {
      throw new Error("Only host can close the auction");
    }

    if (!auction.isActive) {
      throw new Error("Auction already closed");
    }

    // 🔥 Aquí usamos el método correcto del repo
    return await this.auctionRepo.close(auction.id);
  }
}