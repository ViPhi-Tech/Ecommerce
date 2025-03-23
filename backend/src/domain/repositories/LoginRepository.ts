import { Login, CreateLoginDTO, UpdateLoginDTO } from '../entities/Login';

export interface ILoginRepository {
  create(data: Omit<CreateLoginDTO, 'password'> & { hashed_password?: string }): Promise<Login>;
  findById(id: number): Promise<Login | null>;
  findByEmail(email: string): Promise<Login | null>;
  findByGoogleId(googleId: string): Promise<Login | null>;
  update(id: number, data: Omit<UpdateLoginDTO, 'password'> & { hashed_password?: string }): Promise<Login>;
  delete(id: number): Promise<void>;
}