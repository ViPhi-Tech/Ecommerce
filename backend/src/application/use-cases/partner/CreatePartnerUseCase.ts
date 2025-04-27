import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class CreatePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(data: Partner): Promise<Partner> {
    // id?: number;
    // name: string;
    // email: string;
    // phone?: string | null;
    // companyName?: string | null;
    // document?: string | null;
    // type: PartnerType;
    // active: boolean
    return this.partnerRepository.create({name: data.name, email: data.email, phone: data.phone, companyName: data.companyName, document: data.document, type: data.type});
  }
}