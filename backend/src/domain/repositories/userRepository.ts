// backend/src/domain/repositories/UserRepository.ts
import { User } from '../entities/User';

export interface IUserRepository {
  create(data: { full_name: string; is_active?: boolean; login_id: number }): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByLoginId(loginId: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  findAllWithLogin(): Promise<(User & { login: any })[]>;
  update(id: number, data: Partial<{ full_name: string; is_active: boolean }>): Promise<User>;
  delete(id: number): Promise<void>;
  
  // Métodos adicionais para autenticação
  create_user(userData: { full_name: string; is_active?: boolean; login_id: number }): Promise<User>;
  get_or_create_user_by_google(googleId: string, email: string, name: string): Promise<User>;
  create_access_token_for_user(userId: number, token: string): Promise<void>;
  get_user_by_email(email: string): Promise<User | null>;
  authenticate_user(email: string, password: string): Promise<User | null>;
}