export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  roomId: string;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  price: number;
  stock: number;
  roomId: string;
  createdAt: Date;
}