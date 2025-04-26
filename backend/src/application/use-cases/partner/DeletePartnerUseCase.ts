import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class DeletePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(id: number): Promise<void> {
    await this.partnerRepository.delete(id);
  }
}