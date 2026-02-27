import type { Auction } from "../entities/Auction";

export interface IAuctionRepository {

  // Crear subasta
  create(auction: Auction): Promise<Auction>;

  // Obtener subasta activa por sala
  findActiveByRoom(roomId: string): Promise<Auction | null>;

  // Buscar por ID
  findById(id: string): Promise<Auction | null>;

  // Actualizar oferta
  updateBid(
    auctionId: string,
    amount: number,
    userId: string
  ): Promise<Auction>;

  // Cerrar subasta
  close(auctionId: string): Promise<Auction>;
}