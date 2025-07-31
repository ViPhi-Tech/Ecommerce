import { Supplier } from "../entities/Supplier";

export interface ISupplierRepository {
    create(data: Supplier): Promise<Supplier>;
    findById(id: string): Promise<Supplier | null>;
    findAll(): Promise<Supplier[]>;
    update(id: string, data: Partial<Supplier>): Promise<Supplier>;
    delete(id: string): Promise<void>;
    findByCnpj(cnpj: string): Promise<Supplier | null>;
}