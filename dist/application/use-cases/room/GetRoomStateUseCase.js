"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoomStateUseCase = void 0;
class GetRoomStateUseCase {
    constructor(roomRepository) {
        this.roomRepository = roomRepository;
    }
    async execute(roomId) {
        return await this.roomRepository.findById(roomId);
    }
}
exports.GetRoomStateUseCase = GetRoomStateUseCase;
