export interface Dashboard {
  id: number;
  email: string | null;
  googleId?: string | null;
  hashedPassword: string | null;
}
