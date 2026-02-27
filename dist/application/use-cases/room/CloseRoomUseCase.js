"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseRoomUseCase = void 0;
class CloseRoomUseCase {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(roomId) {
        return await this.roomRepository.delete(roomId);
    }
}
exports.CloseRoomUseCase = CloseRoomUseCase;
