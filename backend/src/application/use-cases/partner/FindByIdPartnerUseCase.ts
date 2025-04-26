import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class FindByIdPartnerUseCase {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async execute(id: number): Promise<Partner | null> {
    return await this.partnerRepository.findById(id);
  }
}