import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserNotFoundError } from '../../../shared/errors/UserErrors';

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findAllWithLogin(): Promise<User[]> {
    return this.userRepository.findAllWithLogin();
  }
}