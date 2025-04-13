import { Product } from "../entities/Product";
export interface IProductService {
    create(data: Product): Promise<Product>;
}