import { prisma } from "../../database/prismaClient";
import { CreateProductUseCase } from "../../../application/use-cases/product/CreateProductUseCase";
import { FindByIdProductUseCase } from "../../../application/use-cases/product/FindByIdProductUseCase";
import { UpdateStockUseCase } from "../../../application/use-cases/product/UpdateStockUseCase";
import { DeleteProductUseCase } from "../../../application/use-cases/product/DeleteProductUseCase";
import { ProductRepository } from "../../database/repositories/ProductRepository";
import { UpdateProductUseCase } from "../../../application/use-cases/product/UpdateProductUseCase";
import { FindAllProductUseCase } from "../../../application/use-cases/product/FindAllProductUseCase";
import {ProductController} from "../../http/controllers/ProductController";
import { GetMovimentByProductUseCase } from "../../../application/use-cases/product/GetMovimentByProductUseCase";
import { FindByNameProductUseCase } from "../../../application/use-cases/product/FindProductsByNameUseCase";
import { FindByParamProductUseCase } from "../../../application/use-cases/product/FindByParamUseCase";
import { GetMetricsUseCase } from "../../../application/use-cases/product/GetMetricsUseCase";
import { FindMovimentByDateUseCase } from "../../../application/use-cases/product/FindMovimentByDate";
import { UpdateManyStocksUseCase } from "../../../application/use-cases/product/UpdateManyStocksUseCase";
import { JwtAuthService } from "../../services/AuthService";
import { ValidateProductsUseCase } from "../../../application/use-cases/product/ValidateProductsUseCase";

const JWT_SECRET = process.env.SECRET_KEY || '';

const jwtService = new JwtAuthService(JWT_SECRET);

export const productRepository = new ProductRepository(prisma);

const findByIdProductUseCase = new FindByIdProductUseCase(productRepository);
const updateStockUseCase = new UpdateStockUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);
const findAllProductUseCase = new FindAllProductUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository, updateStockUseCase);
const getMovimentByProductUseCase = new GetMovimentByProductUseCase(productRepository);
const findProductByNameUseCase = new FindByNameProductUseCase(productRepository);
const findProductByParam = new FindByParamProductUseCase(productRepository)
const getMetricsUseCase = new GetMetricsUseCase(productRepository);
const findMovimentByDateUseCase = new FindMovimentByDateUseCase(productRepository);
const validateProductsUseCase = new ValidateProductsUseCase(productRepository);

const movimentManyUseCase = new UpdateManyStocksUseCase(productRepository, jwtService);

export const productController = new ProductController(
    createProductUseCase,
    findByIdProductUseCase,
    updateStockUseCase,
    updateProductUseCase,
    deleteProductUseCase,
    findAllProductUseCase,
    getMovimentByProductUseCase,
    findProductByNameUseCase,
    findProductByParam,
    getMetricsUseCase,
    findMovimentByDateUseCase,
    movimentManyUseCase,
    validateProductsUseCase
);