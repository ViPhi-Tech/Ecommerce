// backend/src/infrastructure/config/userDependencies.ts
import { prisma } from '../../database/prismaClient';
import { UserRepository } from '../../database/repositories/UserRepository';
import { LoginRepository } from '../../database/repositories/LoginRepository';
import { BcryptPasswordService } from '../../services/PasswordService';
import { CreateUserUseCase } from '../../../domain/use-cases/user/CreateUserUseCase';
import { GetUserUseCase } from '../../../domain/use-cases/user/GetUserUseCase';
import { UpdateUserUseCase } from '../../../domain/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '../../../domain/use-cases/user/DeleteUserUseCase';
import { UserController } from '../../http/controllers/UserController';

// Repositories
export const userRepository = new UserRepository(prisma);
export const loginRepository = new LoginRepository(prisma);

// Services
export const passwordService = new BcryptPasswordService();

// Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository, loginRepository, passwordService);
const getUserUseCase = new GetUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository, loginRepository, passwordService);
const deleteUserUseCase = new DeleteUserUseCase(userRepository, loginRepository);

// Controllers
export const userController = new UserController(
  createUserUseCase,
  getUserUseCase,
  updateUserUseCase,
  deleteUserUseCase
);