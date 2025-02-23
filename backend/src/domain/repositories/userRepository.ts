

export interface IUserRepository {
  create_user(id: string): Promise<User | null>;
  get_or_create_user_by_google(email: string): Promise<User | null>;
  create_access_token_for_user(user: User): Promise<void>;
  get_user_by_email(user: User): Promise<void>;
  authenticate_user(id: string): Promise<void>;
}