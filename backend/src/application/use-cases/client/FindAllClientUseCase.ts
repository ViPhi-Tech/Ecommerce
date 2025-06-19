import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class FindAllClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }
} 