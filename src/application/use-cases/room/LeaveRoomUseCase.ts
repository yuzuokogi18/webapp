import type { IRoomRepository } from "../../../domain/repositories/IRoomRepository";

export class LeaveRoomUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomId: string, userId: string) {
    return await this.roomRepository.leave(roomId, userId);
  }
}
