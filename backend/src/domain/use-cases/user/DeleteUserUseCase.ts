import { IUserRepository } from '../../repositories/UserRepository';
import { ILoginRepository } from '../../repositories/LoginRepository';
import { UserNotFoundError } from '../../../shared/errors/UserErrors';

export class DeleteUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private loginRepository: ILoginRepository
  ) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    // Armazenar o login_id antes de excluir o usuário
    const loginId = user.login_id;

    // Excluir o usuário
    await this.userRepository.delete(id);

    // Excluir o login associado
    await this.loginRepository.delete(loginId);
  }
}