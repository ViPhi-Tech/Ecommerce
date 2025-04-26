import { Partner } from '../entities/Partner';

export interface IPartnerRepository {
  create(partner: Partner): Promise<Partner>;
  findAll(): Promise<Partner[]>;
  findById(id: number): Promise<Partner | null>;
  update(id: number, partner: Partner): Promise<Partner | null>;
  delete(id: number): Promise<void>;
}
