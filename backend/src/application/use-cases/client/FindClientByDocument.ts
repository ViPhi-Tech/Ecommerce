import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class FindClientByDocument {
  constructor(private clientRepository: IClientRepository) {}

  async execute(document: string): Promise<Client | null> {
    return await this.clientRepository.findByDocument(document);
  }
} 