"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRoomUseCase = void 0;
class LeaveRoomUseCase {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(roomId, userId) {
        return await this.roomRepository.leave(roomId, userId);
    }
}
exports.LeaveRoomUseCase = LeaveRoomUseCase;
