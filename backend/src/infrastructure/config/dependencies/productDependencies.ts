import { prisma } from "../../database/prismaClient";
import { CreateProductUseCase } from "../../../application/use-cases/product/CreateProductUseCase";
import { FindByIdProductUseCase } from "../../../application/use-cases/product/FindByIdProductUseCase";
import { UpdateStockUseCase } from "../../../application/use-cases/product/UpdateStockUseCase";
import { DeleteProductUseCase } from "../../../application/use-cases/product/DeleteProductUseCase";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import { UpdateProductUseCase } from "../../../application/use-cases/product/UpdateProductUseCase";
import { FindAllProductUseCase } from "../../../application/use-cases/product/FindAllProductUseCase";
import {ProductController} from "../../http/controllers/ProductController";

export const productRepository = new ProductRepository(prisma);

const createProductUseCase = new CreateProductUseCase(productRepository);
const findByIdProductUseCase = new FindByIdProductUseCase(productRepository);
const updateStockUseCase = new UpdateStockUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);
const findAllProductUseCase = new FindAllProductUseCase(productRepository);

export const productController = new ProductController(
    createProductUseCase,
    findByIdProductUseCase,
    updateStockUseCase,
    updateProductUseCase,
    deleteProductUseCase,
    findAllProductUseCase
);