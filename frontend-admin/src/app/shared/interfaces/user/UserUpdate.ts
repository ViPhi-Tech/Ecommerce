export interface UserUpdate {
  id: string | number; // ID do usuário a ser atualizado
  fullName?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}
