import { Product } from "../entities/Product";
import {ProductDTO} from "../../shared/dtos/Product.dto";

export interface IProductRepository {
    create(data: ProductDTO): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(id: number, data: Partial<ProductDTO>): Promise<Product>;
    delete(id: number): Promise<void>;
}