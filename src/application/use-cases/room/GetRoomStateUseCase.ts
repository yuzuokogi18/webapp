import type { IRoomRepository } from "../../../domain/repositories/IRoomRepository";

export class GetRoomStateUseCase {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomId: string) {
    return await this.roomRepository.findById(roomId);
  }
}
