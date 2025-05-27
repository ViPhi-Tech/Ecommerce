import { Category } from "../entities/Category";

export interface ICategoryRepository {
    create(data: Category): Promise<Category>;
    findById(id: number): Promise<Category | null>;
    findAll(): Promise<Category[]>;
    update(id: number, data: Partial<Category>): Promise<Category>;
    delete(id: number): Promise<void>;
}
