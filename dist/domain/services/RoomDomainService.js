"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDomainService = void 0;
class RoomDomainService {
    constructor() {
        this.state = {
            id: "",
            name: "",
            isActive: false,
            participants: 0,
            createdAt: new Date(),
        };
    }
    createRoom(id, name) {
        this.state = {
            id,
            name,
            isActive: true,
            participants: 0,
            createdAt: new Date(),
        };
    }
    closeRoom() {
        this.state.isActive = false;
    }
    joinParticipant() {
        if (!this.state.isActive) {
            throw new Error("Room is closed");
        }
        this.state.participants += 1;
    }
    leaveParticipant() {
        if (this.state.participants > 0) {
            this.state.participants -= 1;
        }
    }
    getState() {
        return { ...this.state };
    }
    isRoomActive() {
        return this.state.isActive;
    }
}
exports.RoomDomainService = RoomDomainService;
