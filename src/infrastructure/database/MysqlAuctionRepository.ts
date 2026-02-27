import type { Pool } from "mysql2/promise";
import type { IAuctionRepository } from "../../domain/repositories/IAuctionRepository";
import type { Auction } from "../../domain/entities/Auction";

export class MysqlAuctionRepository implements IAuctionRepository {
  constructor(private readonly pool: Pool) {}

  async create(auction: Auction): Promise<Auction> {
    await this.pool.execute(
      `INSERT INTO auctions
       (id, room_id, product_id, host_id, highest_bid, highest_bidder, ends_at, is_active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        auction.id,
        auction.roomId,
        auction.productId,
        auction.hostId,
        auction.highestBid,
        auction.highestBidder,
        auction.endsAt,
        auction.isActive,
        auction.createdAt,
      ]
    );

    return auction;
  }

  async findActiveByRoom(roomId: string): Promise<Auction | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT 
        id,
        room_id AS roomId,
        product_id AS productId,
        host_id AS hostId,
        highest_bid AS highestBid,
        highest_bidder AS highestBidder,
        ends_at AS endsAt,
        is_active AS isActive,
        created_at AS createdAt
       FROM auctions
       WHERE room_id = ? AND is_active = true
       LIMIT 1`,
      [roomId]
    );

    return rows.length ? rows[0] : null;
  }

  async findById(id: string): Promise<Auction | null> {
    const [rows] = await this.pool.execute<any[]>(
      `SELECT 
        id,
        room_id AS roomId,
        product_id AS productId,
        host_id AS hostId,
        highest_bid AS highestBid,
        highest_bidder AS highestBidder,
        ends_at AS endsAt,
        is_active AS isActive,
        created_at AS createdAt
       FROM auctions
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return rows.length ? rows[0] : null;
  }

  async updateBid(
    auctionId: string,
    amount: number,
    userId: string
  ): Promise<Auction> {
    await this.pool.execute(
      `UPDATE auctions
       SET highest_bid = ?, highest_bidder = ?
       WHERE id = ? AND is_active = true`,
      [amount, userId, auctionId]
    );

    const updated = await this.findById(auctionId);

    if (!updated) {
      throw new Error("Auction not found after bid update");
    }

    return updated;
  }

  async close(auctionId: string): Promise<Auction> {
    await this.pool.execute(
      `UPDATE auctions
       SET is_active = false
       WHERE id = ?`,
      [auctionId]
    );

    const closed = await this.findById(auctionId);

    if (!closed) {
      throw new Error("Auction not found after close");
    }

    return closed;
  }
}