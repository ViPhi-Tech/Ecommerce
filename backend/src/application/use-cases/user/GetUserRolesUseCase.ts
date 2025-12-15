import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserNotFoundError } from '../../../shared/errors/UserErrors';


export class GetUserRolesUseCase {
  constructor(private userRepository: IUserRepository) {}

    async execute(userId: number): Promise<string[]> {
        const userRoles = await this.userRepository.getUserRoles(userId);
        if (!userRoles) {
            throw new UserNotFoundError();
        }
        return userRoles;
    }
}   