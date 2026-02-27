import type { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute() {
    return await this.userRepository.findAll();
  }
}
