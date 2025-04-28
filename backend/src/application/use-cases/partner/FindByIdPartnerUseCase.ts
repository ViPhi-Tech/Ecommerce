import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { PartnerResponse } from '../../dto/partner/PartnerResponse';

export class FindByIdPartnerUseCase {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async execute(id: number): Promise<PartnerResponse | null> {
    return await this.partnerRepository.findById(id);
  }
}