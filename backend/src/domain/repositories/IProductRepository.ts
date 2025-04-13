import { Product } from "../entities/Product";
import {ProductCreateDTO, ProductDTO} from "../../shared/dtos/Product.dto";

export interface IProductRepository {
    create(data: ProductCreateDTO): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(id: number, data: Partial<ProductDTO>): Promise<Product>;
    delete(id: number): Promise<void>;
    updateStock(sku: number, quantity: number): Promise<void>;
}