import type { IRoomRepository } from "../../../domain/repositories/IRoomRepository";

export class CloseRoomUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomId: string) {
    return await this.roomRepository.delete(roomId);
  }
}
