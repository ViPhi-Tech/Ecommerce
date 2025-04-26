import { Partner } from '../entities/Partner';

export interface IPartnerRepository {
  create(partner: Partner): Promise<Partner>;
  findAll(): Promise<Partner[]>;
  findById(id: string): Promise<Partner | null>;
  update(id: string, partner: Partner): Promise<Partner | null>;
  delete(id: string): Promise<void>;
}
