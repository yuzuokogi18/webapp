export interface CreateVoteDto {
  userId: string;
  productId: string;
  value: number; // 1 a 5 por ejemplo
}

export interface VoteResponseDto {
  id: string;
  userId: string;
  productId: string;
  value: number;
  createdAt: Date;
}