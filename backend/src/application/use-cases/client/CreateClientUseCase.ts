import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class CreateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(data: Partial<Client>): Promise<Client> {
    return this.clientRepository.create(data);
  }
} 