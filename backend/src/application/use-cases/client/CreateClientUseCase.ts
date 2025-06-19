import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { CreateClientInput } from '../../dto/client/CreateUserInput';
import { ClientResponse } from '../../dto/client/ClienteResponse';

export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(data: CreateClientInput): Promise<ClientResponse> {
    try {
      const createdClient = await this.clientRepository.create({
        fullName: data.fullName,
        email: data.email,
        document: data.document,
        phone: data.phone ?? null,
        isActive: data.isActive ?? true,
      });

      return createdClient;

    } catch (error: any) {
      console.log('Erro ao criar cliente:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        cause: error.cause,
      });

      const message = error?.message?.toLowerCase() ?? '';

      if (message.includes('email')) {
        throw new Error('Já existe um cliente com este e-mail');
      }

      if (message.includes('document')) {
        throw new Error('Já existe um cliente com este documento');
      }

      throw new Error(error.message || 'Erro interno ao criar cliente');
    }
  }
}