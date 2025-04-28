import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { CreatePartnerInput } from '../../dto/partner/CreatePartnerInput';
import { PartnerResponse } from '../../dto/partner/PartnerResponse';

export class UpdatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(id: number, partner: CreatePartnerInput): Promise<PartnerResponse | null> {
    return this.partnerRepository.update(id, partner);
  }
}