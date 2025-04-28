import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { PartnerResponse } from '../../dto/partner/PartnerResponse';

export class FindAllPartnerUseCase {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async execute(): Promise<PartnerResponse[]> {
    return this.partnerRepository.findAll();
  }
}