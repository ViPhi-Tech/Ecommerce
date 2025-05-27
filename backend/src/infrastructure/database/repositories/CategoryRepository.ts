import { PrismaClient } from '@prisma/client';
import { Category } from '../../../domain/entities/Category';
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { CategoryCreateDTO, CategoryDTO } from "../../http/dto/Category.dto";

export class CategoryRepository implements ICategoryRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: CategoryCreateDTO): Promise<Category> {
        return await this.prisma.category.create({
            data: {
                name: data.name,

            } 
        });
    }

    async findAll(): Promise<Category[]> {
      return this.prisma.category.findMany();
    }

    async findById(id: number): Promise<Category | null> {
        return this.prisma.category.findUnique({
            where: {id}
        });
    }

    async update(id: number, data: Partial<CategoryDTO>): Promise<Category> {
        return this.prisma.category.update({
            where: {id},
            data
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.category.delete({
            where: {id}
        });
    };
}
