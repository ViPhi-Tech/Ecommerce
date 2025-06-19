import { IClientRepository } from '../../../domain/repositories/IClientRepository';

export class DeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }
} 