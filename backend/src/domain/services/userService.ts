import { User } from '../entities/User';

export interface IUserService {
  authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; message: string }>;
  createAccessTokenForUser(userId: number, email: string): Promise<string>;
  getOrCreateUserByGoogle(googleUserInfo: { id: string; email: string; name: string }): Promise<User>;
}