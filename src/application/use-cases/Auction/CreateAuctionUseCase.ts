// application/use-cases/auction/CreateAuctionUseCase.ts

import crypto from "crypto";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

interface CreateAuctionDTO {
  roomId: string;
  productId: string;
  hostId: string;
  startingPrice: number;
  duration: number;
}

export class CreateAuctionUseCase {
  constructor(private readonly auctionRepo: IAuctionRepository) {}

  async execute(data: CreateAuctionDTO): Promise<Auction> {

    // 1️⃣ Validar que no exista subasta activa
    const existing = await this.auctionRepo.findActiveByRoom(data.roomId);
    if (existing) {
      throw new Error("Auction already active in this room");
    }

    // 2️⃣ Crear objeto Auction (sin new)
    const auction: Auction = {
      id: crypto.randomUUID(),
      roomId: data.roomId,
      productId: data.productId,
      hostId: data.hostId,
      highestBid: data.startingPrice,
      highestBidder: null,
      endsAt: Date.now() + data.duration,
      isActive: true,
      createdAt: new Date()
    };

    // 3️⃣ Guardar
    await this.auctionRepo.create(auction);

    return auction;
  }
}