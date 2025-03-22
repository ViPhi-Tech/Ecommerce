export interface Login {
  id: number;
  email: string;
  google_id?: string | null;
  hashed_password: string;
}

export type CreateLoginDTO = {
  email: string;
  google_id?: string;
  password: string; // Senha em texto puro, será hasheada antes de salvar
};

export type UpdateLoginDTO = Partial<{
  email: string;
  google_id?: string;
  password: string; // Senha em texto puro, será hasheada antes de salvar
}>;