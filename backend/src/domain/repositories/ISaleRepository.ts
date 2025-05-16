import { Sale } from '../entities/Sale';
import { SaleItem } from '../entities/SaleItem';



export interface ISaleRepository {
    create(data: Sale): Promise<Sale>;
    findById(id: number): Promise<Sale | null>;
    findAll(): Promise<Sale[]>;
    update(id: number, data: Partial<Sale>): Promise<Sale>;
    delete(id: number): Promise<void>;
}