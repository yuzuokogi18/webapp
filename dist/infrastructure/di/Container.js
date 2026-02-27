"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const DatabaseConnection_1 = require("../database/DatabaseConnection");
const MysqlUserRepository_1 = require("../database/MysqlUserRepository");
const MysqlRoomRepository_1 = require("../database/MysqlRoomRepository");
const CreateUserUseCase_1 = require("../../application/use-cases/user/CreateUserUseCase");
const JoinRoomUseCase_1 = require("../../application/use-cases/room/JoinRoomUseCase");
const LeaveRoomUseCase_1 = require("../../application/use-cases/room/LeaveRoomUseCase");
const HttpApiServer_1 = require("../http/HttpApiServer");
const RoomWebSocketServer_1 = require("../websocket/RoomWebSocketServer");
class Container {
    static bootstrap() {
        // 🔹 Database
        const pool = (0, DatabaseConnection_1.getDatabase)();
        // 🔹 Repositories
        const userRepo = new MysqlUserRepository_1.MysqlUserRepository(pool);
        const roomRepo = new MysqlRoomRepository_1.MysqlRoomRepository(pool);
        // 🔹 Use Cases
        const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userRepo);
        const joinRoomUseCase = new JoinRoomUseCase_1.JoinRoomUseCase(roomRepo);
        const leaveRoomUseCase = new LeaveRoomUseCase_1.LeaveRoomUseCase(roomRepo);
        // 🔹 Servers
        new HttpApiServer_1.HttpApiServer(3000);
        new RoomWebSocketServer_1.RoomWebSocketServer(4000, joinRoomUseCase, leaveRoomUseCase);
        console.log("🔥 Application Bootstrapped");
    }
}
exports.Container = Container;
