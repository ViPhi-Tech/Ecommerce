import { prisma } from "../../database/prismaClient";
import { CreateCategoryUseCase } from "../../../application/use-cases/category/CreateCategoryUseCase";
import { FindByIdCategoryUseCase } from "../../../application/use-cases/category/FindByIdCategoryUseCase";
import { DeleteCategoryUseCase } from "../../../application/use-cases/category/DeleteCategoryUseCase";
import { CategoryRepository } from "../../database/repositories/CategoryRepository";
import { UpdateCategoryUseCase } from "../../../application/use-cases/category/UpdateCategoryUseCase";
import { FindAllCategoryUseCase } from "../../../application/use-cases/category/FindAllCategoryUseCase";
import { CategoryController } from "../../http/controllers/CategoryController";

export const categoryRepository = new CategoryRepository(prisma);

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
const findByIdCategoryUseCase = new FindByIdCategoryUseCase(categoryRepository);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
const findAllCategoryUseCase = new FindAllCategoryUseCase(categoryRepository);

export const categoryController = new CategoryController(
    createCategoryUseCase,
    findByIdCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
    findAllCategoryUseCase
);
