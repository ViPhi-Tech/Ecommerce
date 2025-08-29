export interface IUserCreate {
  id?: string | number; // ID opcional para criação (geralmente não é necessário)
  fullName: string;
  email: string;
  password?: string;
  isActive?: boolean;
  modules?: string[]; // Módulos permitidos para o usuário
}
