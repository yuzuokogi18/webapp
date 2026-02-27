"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinRoomUseCase = void 0;
class JoinRoomUseCase {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(roomId, userId) {
        return await this.roomRepository.join(roomId, userId);
    }
}
exports.JoinRoomUseCase = JoinRoomUseCase;
