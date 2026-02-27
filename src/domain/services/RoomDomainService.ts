export interface RoomState {
  id: string;
  name: string;
  isActive: boolean;
  participants: number;
  createdAt: Date;
}

export class RoomDomainService {
  private state: RoomState;

  constructor() {
    this.state = {
      id: "",
      name: "",
      isActive: false,
      participants: 0,
      createdAt: new Date(),
    };
  }

  createRoom(id: string, name: string): void {
    this.state = {
      id,
      name,
      isActive: true,
      participants: 0,
      createdAt: new Date(),
    };
  }

  closeRoom(): void {
    this.state.isActive = false;
  }

  joinParticipant(): void {
    if (!this.state.isActive) {
      throw new Error("Room is closed");
    }

    this.state.participants += 1;
  }

  leaveParticipant(): void {
    if (this.state.participants > 0) {
      this.state.participants -= 1;
    }
  }

  getState(): Readonly<RoomState> {
    return { ...this.state };
  }

  isRoomActive(): boolean {
    return this.state.isActive;
  }
}