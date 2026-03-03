import { getDatabase } from "../database/DatabaseConnection";

// 🔹 Repositories
import { MysqlUserRepository } from "../database/MysqlUserRepository";
import { MysqlRoomRepository } from "../database/MysqlRoomRepository";
import { MysqlAuctionRepository } from "../database/MysqlAuctionRepository";
import { MysqlVoteRepository } from "../database/MysqlVoteRepository"; // ✅ NUEVO

// 🔹 User / Room UseCases
import { CreateUserUseCase } from "../../application/use-cases/user/CreateUserUseCase";
import { JoinRoomUseCase } from "../../application/use-cases/room/JoinRoomUseCase";
import { LeaveRoomUseCase } from "../../application/use-cases/room/LeaveRoomUseCase";

// 🔹 Auction UseCases
import { CreateAuctionUseCase } from "../../application/use-cases/Auction/CreateAuctionUseCase";
import { PlaceBidUseCase } from "../../application/use-cases/Auction/PlaceBidUseCase";
import { CloseAuctionUseCase } from "../../application/use-cases/Auction/CloseAuctionUseCase";
import { GetActiveAuctionUseCase } from "../../application/use-cases/Auction/GetActiveAuctionUseCase";

// 🔹 Vote UseCase
import { VoteProductUseCase } from "../../application/use-cases/vote/VoteProductUseCase"; // ✅ NUEVO

// 🔹 Servers
import { HttpApiServer } from "../http/HttpApiServer";
import { RoomWebSocketServer } from "../websocket/RoomWebSocketServer";

export class Container {
  static bootstrap() {

    // ========================
    // 🔹 Database
    // ========================
    const pool = getDatabase();

    // ========================
    // 🔹 Repositories
    // ========================
    const userRepo = new MysqlUserRepository(pool);
    const roomRepo = new MysqlRoomRepository(pool);
    const auctionRepo = new MysqlAuctionRepository(pool);
    const voteRepo = new MysqlVoteRepository(pool); // ✅ NUEVO

    // ========================
    // 🔹 Use Cases
    // ========================
    const createUserUseCase = new CreateUserUseCase(userRepo);

    const joinRoomUseCase = new JoinRoomUseCase(roomRepo);
    const leaveRoomUseCase = new LeaveRoomUseCase(roomRepo);

    const createAuctionUseCase = new CreateAuctionUseCase(auctionRepo);
    const placeBidUseCase = new PlaceBidUseCase(auctionRepo);
    const closeAuctionUseCase = new CloseAuctionUseCase(auctionRepo);
    const getActiveAuctionUseCase = new GetActiveAuctionUseCase(auctionRepo);

    const voteUseCase = new VoteProductUseCase(voteRepo); // ✅ NUEVO

    // ========================
    // 🔹 Servers
    // ========================
    new HttpApiServer(3000);

    new RoomWebSocketServer(
      4000,
      joinRoomUseCase,
      leaveRoomUseCase,
      createAuctionUseCase,
      placeBidUseCase,
      closeAuctionUseCase,
      getActiveAuctionUseCase,
      voteUseCase // ✅ NUEVO
    );

    console.log("🔥 Application Bootstrapped");
  }
}