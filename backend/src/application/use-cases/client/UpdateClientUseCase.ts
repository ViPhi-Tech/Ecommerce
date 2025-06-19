import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: number, data: Partial<Client>): Promise<Client> {
    return this.clientRepository.update(id, data);
  }
} 