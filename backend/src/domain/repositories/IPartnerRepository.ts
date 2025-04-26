import { Partner } from "../entities/Partner";

export interface IPartnertRepository {
    create(data: Partner): Promise<Partner>;
    findById(id: number): Promise<Partner | null>;
    findAll(): Promise<Partner[]>;
    update(id: number, data: Partial<Partner>): Promise<Partner>;
    delete(id: number): Promise<void>;
}