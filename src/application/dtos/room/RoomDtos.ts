export interface CreateRoomDto {
  name: string;
  description: string;
  createdBy: string; // id del usuario
}

export interface UpdateRoomDto {
  name?: string;
  description?: string;
}

export interface RoomResponseDto {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}