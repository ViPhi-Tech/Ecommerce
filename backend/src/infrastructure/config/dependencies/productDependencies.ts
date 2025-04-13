import { prisma } from "../../database/prismaClient";
import { CreateProductUseCase } from "../../../domain/use-cases/product/CreateProductUseCase";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import {ProductController} from "../../http/controllers/ProductController";

export const productRepository = new ProductRepository(prisma);


const createProductUseCase = new CreateProductUseCase(productRepository);

export const productController = new ProductController(
    createProductUseCase
);