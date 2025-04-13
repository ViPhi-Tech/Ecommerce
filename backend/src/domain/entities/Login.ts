export interface Login {
  id: number;
  email: string | null;
  googleId?: string | null;
  hashedPassword: string | null;
}
