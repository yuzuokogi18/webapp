export interface AddToCartDto {
  userId: string;
  productId: string;
  quantity: number;
}

export interface UpdateCartDto {
  quantity: number;
}

export interface CartResponseDto {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
}