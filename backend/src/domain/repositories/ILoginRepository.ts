import { Login } from '../entities/Login';
import { CreateLoginDTO, UpdateLoginDTO } from '../../application/dto/login/LoginDTOs';

export interface ILoginRepository {
  create(data: Omit<CreateLoginDTO, 'password'> & { hashedPassword?: string | null }): Promise<Login>;
  findById(id: number): Promise<Login | null>;
  findByEmail(email: string): Promise<Login | null>;
  findByGoogleId(googleId: string): Promise<Login | null>;
  findByCreatePasswordToken(token: string): Promise<Login | null>;
  update(id: number, data: Partial<{
    email: string;
    googleId: string | null;
    hashedPassword: string | null;
    createPasswordToken: string | null;
    createPasswordTokenExpiresAt: Date | null;
  }>): Promise<Login>;
  delete(id: number): Promise<void>;
}