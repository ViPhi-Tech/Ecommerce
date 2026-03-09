export interface CreatePasswordEmailVariables {
  createPasswordUrl: string;
  fullName: string;
  expiryHours: string;
}

export interface IEmailService {
  /**
   * Envia e-mail com link para o usuário criar a primeira senha.
   * As variáveis do template ({{var}}) são substituídas pelos valores fornecidos.
   */
  sendCreatePasswordEmail(to: string, variables: CreatePasswordEmailVariables): Promise<void>;
}
