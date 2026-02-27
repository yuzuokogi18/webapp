import type { User } from "../entities/User";
import type { CreateUserDto } from "../../application/dtos/user/UserDtos";

export interface IUserRepository {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Partial<CreateUserDto>): Promise<User>;
  delete(id: string): Promise<void>;
}
