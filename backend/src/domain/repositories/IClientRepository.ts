import { Client } from "../entities/Client";

export interface IClientRepository {
  create(data: Partial<Client>): Promise<Client>;
  findAll(): Promise<Client[]>;
  findById(id: number): Promise<Client | null>;
  update(id: number, data: Partial<Client>): Promise<Client>;
  findByDocument(document: string): Promise<Client | null>;
  delete(id: number): Promise<void>;
  countByMonth(initialMonth: number, finalMonth: number): Promise<number>;
  countActive(): Promise<number>;
} 