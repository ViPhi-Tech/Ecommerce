export interface IUserModule {
  id: string;
  name: string;
  description: string;
  route: string;
}

export interface IUserPermissions {
  modules: string[]; // Array de IDs dos módulos permitidos
}
