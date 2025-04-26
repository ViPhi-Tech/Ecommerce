import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class FindAllPartnerUseCase {
  constructor(private readonly partnerRepository: IPartnerRepository) {}

  async execute(): Promise<Partner[]> {
    return this.partnerRepository.findAll();
  }
}