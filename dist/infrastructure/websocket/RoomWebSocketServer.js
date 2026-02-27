"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomWebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
class RoomWebSocketServer {
    constructor(port, joinUseCase, leaveUseCase) {
        this.joinUseCase = joinUseCase;
        this.leaveUseCase = leaveUseCase;
        const httpServer = (0, http_1.createServer)();
        this.io = new socket_io_1.Server(httpServer, {
            cors: { origin: "*" },
        });
        this.io.on("connection", (socket) => {
            console.log("🔌 Client connected:", socket.id);
            socket.on("join_room", async (data) => {
                try {
                    const result = await this.joinUseCase.execute(data.roomId, data.userId);
                    socket.join(data.roomId);
                    this.io.to(data.roomId).emit("user_joined", result);
                }
                catch (err) {
                    socket.emit("error", "Join failed");
                }
            });
            socket.on("leave_room", async (data) => {
                try {
                    const result = await this.leaveUseCase.execute(data.roomId, data.userId);
                    socket.leave(data.roomId);
                    this.io.to(data.roomId).emit("user_left", result);
                }
                catch {
                    socket.emit("error", "Leave failed");
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
exports.RoomWebSocketServer = RoomWebSocketServer;
