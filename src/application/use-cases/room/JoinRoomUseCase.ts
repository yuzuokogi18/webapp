import type { IRoomRepository } from "../../../domain/repositories/IRoomRepository";

export class JoinRoomUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomId: string, userId: string) {
    return await this.roomRepository.join(roomId, userId);
  }
}
