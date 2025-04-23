import { prisma } from "../../database/prismaClient";
import { CreateProductUseCase } from "../../../application/use-cases/product/CreateProductUseCase";
import { FindByIdProductUseCase } from "../../../application/use-cases/product/FindByIdProductUseCase";
import { UpdateStockUseCase } from "../../../application/use-cases/product/UpdateStockUseCase";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import {ProductController} from "../../http/controllers/ProductController";

export const productRepository = new ProductRepository(prisma);

const createProductUseCase = new CreateProductUseCase(productRepository);
const findByIdProductUseCase = new FindByIdProductUseCase(productRepository);
const updateStockUseCase = new UpdateStockUseCase(productRepository);

export const productController = new ProductController(
    createProductUseCase,
    findByIdProductUseCase,
    updateStockUseCase
);