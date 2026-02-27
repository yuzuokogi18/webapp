import type { CreateUserDto } from "../../dtos/user/UserDtos";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDto) {
    return await this.userRepository.create(data);
  }
}
