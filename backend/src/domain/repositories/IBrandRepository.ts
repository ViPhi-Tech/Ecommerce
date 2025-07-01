import { Brand } from "../entities/Brand";

export interface IBrandRepository {
    create(data: Brand): Promise<Brand>;
    findById(id: number): Promise<Brand | null>;
    findAll(): Promise<Brand[]>;
    update(id: number, data: Partial<Brand>): Promise<Brand>;
    delete(id: number): Promise<void>;
}