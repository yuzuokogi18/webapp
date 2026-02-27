import type { Room } from "../entities/Room";
import type { CreateRoomDto } from "../../application/dtos/room/RoomDtos";

export interface IRoomRepository {
  create(data: CreateRoomDto): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  update(id: string, data: Partial<CreateRoomDto>): Promise<Room>;
  delete(id: string): Promise<void>;
  join(roomId: string, userId: string): Promise<Room>;
  leave(roomId: string, userId: string): Promise<Room>;
}
