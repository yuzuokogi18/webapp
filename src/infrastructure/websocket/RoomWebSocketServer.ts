import { Server } from "socket.io";
import { createServer } from "http";

import type { JoinRoomUseCase } from "../../application/use-cases/room/JoinRoomUseCase";
import type { LeaveRoomUseCase } from "../../application/use-cases/room/LeaveRoomUseCase";

import type { CreateAuctionUseCase } from "../../application/use-cases/Auction/CreateAuctionUseCase"; 
import type { PlaceBidUseCase } from "../../application/use-cases/Auction/PlaceBidUseCase";
import type { CloseAuctionUseCase } from "../../application/use-cases/Auction/CloseAuctionUseCase";
import type { GetActiveAuctionUseCase } from "../../application/use-cases/Auction/GetActiveAuctionUseCase";

import type { VoteProductUseCase } from "../../application/use-cases/vote/VoteProductUseCase";

export class RoomWebSocketServer {
  private io: Server;

  constructor(
    port: number,
    private readonly joinUseCase: JoinRoomUseCase,
    private readonly leaveUseCase: LeaveRoomUseCase,
    private readonly createAuctionUseCase: CreateAuctionUseCase,
    private readonly placeBidUseCase: PlaceBidUseCase,
    private readonly closeAuctionUseCase: CloseAuctionUseCase,
    private readonly getActiveAuctionUseCase: GetActiveAuctionUseCase,
    private readonly voteUseCase: VoteProductUseCase   // ✅ NUEVO
  ) {
    const httpServer = createServer();

    this.io = new Server(httpServer, {
      cors: { origin: "*" },
    });

    this.io.on("connection", (socket) => {
      console.log("🔌 Client connected:", socket.id);

      /*
      =========================
      JOIN ROOM
      =========================
      */
      socket.on("join_room", async (data) => {
        try {
          if (!data.roomId || !data.userId) {
            socket.emit("error", "roomId y userId son requeridos");
            return;
          }

          const result = await this.joinUseCase.execute(
            data.roomId,
            data.userId
          );

          socket.join(data.roomId);

          const auction = await this.getActiveAuctionUseCase.execute(
            data.roomId
          );

          if (auction) {
            socket.emit("product_created", auction);
          }

          this.io.to(data.roomId).emit("user_joined", result);

        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });

      /*
      =========================
      LEAVE ROOM
      =========================
      */
      socket.on("leave_room", async (data) => {
        try {
          const result = await this.leaveUseCase.execute(
            data.roomId,
            data.userId
          );

          socket.leave(data.roomId);

          this.io.to(data.roomId).emit("user_left", result);

        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });

      /*
      =========================
      HOST CREA PRODUCTO / SUBASTA
      =========================
      */
      socket.on("create_product", async (data) => {
        try {
          const auction = await this.createAuctionUseCase.execute({
            roomId: data.roomId,
            productId: data.productId,
            hostId: data.userId,
            startingPrice: data.price,
            duration: data.duration || 30000,
          });

          this.io.to(data.roomId).emit("product_created", auction);

        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });

      /*
      =========================
      NUEVA PUJA (SUBASTA)
      =========================
      */
      socket.on("bid", async (data) => {
        try {
          const auction = await this.placeBidUseCase.execute(
            data.roomId,
            data.userId,
            data.amount
          );

          this.io.to(data.roomId).emit("new_bid", auction);

        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });

      /*
      =========================
      NUEVO VOTO DE PRODUCTO
      =========================
      */
      socket.on("vote_product", async (data) => {
        try {
          if (!data.roomId || !data.productId || !data.userId || !data.value) {
            socket.emit("error", "Datos incompletos para votar");
            return;
          }

          const vote = await this.voteUseCase.execute({
            userId: data.userId,
            productId: data.productId,
            value: data.value,
          });

          // 🔥 Emitir a todos en la sala
          this.io.to(data.roomId).emit("new_vote", vote);

        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });

      /*
      =========================
      CERRAR SUBASTA MANUAL
      =========================
      */
      socket.on("close_auction", async (data) => {
        try {
          const auction = await this.closeAuctionUseCase.execute(
            data.roomId,
            data.userId
          );

          this.io.to(data.roomId).emit("auction_closed", auction);

        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    httpServer.listen(port, () => {
      console.log(`🚀 WebSocket running on http://localhost:${port}`);
    });
  }
}