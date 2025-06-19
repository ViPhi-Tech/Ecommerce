import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class FindByIdClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: number): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }
} 