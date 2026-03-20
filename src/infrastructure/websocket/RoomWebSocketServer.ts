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
    private readonly voteUseCase: VoteProductUseCase
  ) {
    const httpServer = createServer();

    this.io = new Server(httpServer, {
      cors: { 
        origin: "*",
        methods: ["GET", "POST"] 
      },
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

          const result = await this.joinUseCase.execute(data.roomId, data.userId);
          socket.join(data.roomId);

          // Si ya hay una subasta activa, se la mandamos al que acaba de entrar
          const auction = await this.getActiveAuctionUseCase.execute(data.roomId);

          if (auction) {
            // Nos aseguramos de que el objeto tenga el productId que el front espera
            socket.emit("product_created", {
              ...auction,
              productId: auction.productId || data.productId 
            });
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
          const result = await this.leaveUseCase.execute(data.roomId, data.userId);
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
      NUEVA PUJA (SUBASTA) - CORREGIDO
      =========================
      */
      socket.on("bid", async (data) => {
        try {
          console.log(`📩 Intento de puja: Sala ${data.roomId}, User ${data.userId}, Cantidad ${data.amount}`);
          
          const auction = await this.placeBidUseCase.execute(
            data.roomId,
            data.userId,
            data.amount
          );

          // 🔥 IMPORTANTE: Inyectamos el productId para que el Front lo reconozca
          const bidPayload = {
            ...auction,
            productId: auction.productId || data.productId 
          };

          this.io.to(data.roomId).emit("new_bid", bidPayload);
          console.log(`✅ Puja exitosa enviada a sala ${data.roomId}`);

        } catch (err: any) {
          console.error("❌ Error en bid:", err.message);
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

          this.io.to(data.roomId).emit("new_vote", {
            ...vote,
            productId: data.productId // Aseguramos ID para el front
          });

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
      console.log(`🚀 WebSocket running on port ${port}`);
    });
  }
}