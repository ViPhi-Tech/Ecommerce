// backend/src/domain/repositories/UserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  create(data: { fullName: string; isActive?: boolean; loginId: number }): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByLoginId(loginId: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findAllWithLogin(): Promise<(User & { login: any })[]>;
  update(id: number, data: Partial<{ fullName: string; isActive: boolean }>): Promise<User>;
  delete(id: number): Promise<void>;
  createRoles(userId: number, roles: string[]): Promise<void>;
  updateRoles(userId: number, roles: string[]): Promise<void>;
  // Métodos adicionais para autenticação
  create_user(userData: { fullName: string; isActive?: boolean; loginId: number }): Promise<User>;
  get_or_create_user_by_google(googleId: string, email: string, name: string): Promise<User>;
  create_access_token_for_user(userId: number, token: string): Promise<void>;
  get_user_by_email(email: string): Promise<User | null>;
  authenticate_user(email: string, password: string): Promise<User | null>;
  getUserRoles(userId: number): Promise<string[]>;
  
}