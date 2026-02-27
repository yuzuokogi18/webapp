// application/use-cases/auction/PlaceBidUseCase.ts

import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

export class PlaceBidUseCase {
  constructor(private readonly auctionRepo: IAuctionRepository) {}

  async execute(
    roomId: string,
    userId: string,
    amount: number
  ): Promise<Auction> {

    const auction = await this.auctionRepo.findActiveByRoom(roomId);

    if (!auction) {
      throw new Error("No active auction in this room");
    }

    if (!auction.isActive) {
      throw new Error("Auction is closed");
    }

    if (Date.now() > auction.endsAt) {
      throw new Error("Auction has ended");
    }

    if (amount <= auction.highestBid) {
      throw new Error("Bid must be higher than current highest bid");
    }

    // 🔥 Aquí usamos updateBid en vez de update
    return await this.auctionRepo.updateBid(
      auction.id,
      amount,
      userId
    );
  }
}