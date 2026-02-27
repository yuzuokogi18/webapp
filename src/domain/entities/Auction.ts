export interface Auction {
  id: string;
  roomId: string;
  productId: string;
  hostId: string;
  highestBid: number;
  highestBidder: string | null;
  endsAt: number;
  isActive: boolean;
  createdAt: Date;
}