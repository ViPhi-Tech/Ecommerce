import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { CreatePartnerInput } from '../../dto/partner/CreatePartnerInput';
import { PartnerResponse } from '../../dto/partner/PartnerResponse';

export class CreatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(data: CreatePartnerInput): Promise<PartnerResponse> {
    return this.partnerRepository.create({name: data.name, email: data.email, phone: data.phone, companyName: data.companyName, document: data.document, type: data.type});
  }
}