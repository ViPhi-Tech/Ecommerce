import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class CreatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(partner: Partner): Promise<Partner> {
    return this.partnerRepository.create(partner);
  }
}