import { Login } from '../entities/Login';
import { CreateLoginDTO, UpdateLoginDTO } from '../../application/dto/login/LoginDTOs';

export interface ILoginRepository {
  create(data: Omit<CreateLoginDTO, 'password'> & { hashedPpassword?: string }): Promise<Login>;
  findById(id: number): Promise<Login | null>;
  findByEmail(email: string): Promise<Login | null>;
  findByGoogleId(googleId: string): Promise<Login | null>;
  update(id: number, data: Omit<UpdateLoginDTO, 'password'> & { hashedPassword?: string }): Promise<Login>;
  delete(id: number): Promise<void>;
}