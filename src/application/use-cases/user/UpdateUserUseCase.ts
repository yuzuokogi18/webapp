import type { UpdateUserDto } from "../../dtos/user/UserDtos";
import type { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDto) {
    return await this.userRepository.update(id, data);
  }
}
