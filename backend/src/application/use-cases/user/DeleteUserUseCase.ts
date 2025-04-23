import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ILoginRepository } from '../../../domain/repositories/ILoginRepository';
import { UserNotFoundError, NullValueError } from '../../../shared/errors/UserErrors';

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
    const loginId = user.loginId;

    // Excluir o usuário
    await this.userRepository.delete(id);

    // Excluir o login associado
    if (loginId === null) {
      throw new NullValueError('loginId');
    }
    await this.loginRepository.delete(loginId);
  }
}