import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class UpdatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(id: number, partner: Partner): Promise<Partner | null> {
    return this.partnerRepository.update(id, partner);
  }
}