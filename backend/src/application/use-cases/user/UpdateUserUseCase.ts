import { User } from '../../../domain/entities/User';
import { UpdateUserDTO } from '../../dto/user/UserDTOs';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserNotFoundError } from '../../../shared/errors/UserErrors';

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
  ) {}

  async execute(id: number, userData: UpdateUserDTO, roles?: string[]): Promise<User> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Atualizar nome / status
    await this.userRepository.update(id, userData);

    // Atualizar roles se fornecidas
    if (roles) {
      await this.userRepository.updateRoles(id, roles);
    }

    // Retornar usuário atualizado já com roles atuais
    const updated = await this.userRepository.findById(id);
    return (updated as User);
  }
}