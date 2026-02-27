export interface Room {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  isActive: boolean;
  participants: string[];
  createdAt: Date;
}
