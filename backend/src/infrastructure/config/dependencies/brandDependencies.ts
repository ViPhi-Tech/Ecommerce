import { prisma } from "../../database/prismaClient";
import { CreateBrandUseCase } from "../../../application/use-cases/brand/CreateBrandUseCase";
import { FindByIdBrandUseCase } from "../../../application/use-cases/brand/FindByIdBrandUseCase";
import { DeleteBrandUseCase } from "../../../application/use-cases/brand/DeleteBrandUseCase";
import { BrandRepository } from "../../database/repositories/BrandRepository";
import { UpdateBrandUseCase } from "../../../application/use-cases/brand/UpdateBrandUseCase";
import { FindAllBrandUseCase } from "../../../application/use-cases/brand/FindAllBrandUseCase";
import { BrandController } from "../../http/controllers/BrandController";

export const brandRepository = new BrandRepository(prisma);

const createBrandUseCase = new CreateBrandUseCase(brandRepository);
const findByIdBrandUseCase = new FindByIdBrandUseCase(brandRepository);
const updateBrandUseCase = new UpdateBrandUseCase(brandRepository);
const deleteBrandUseCase = new DeleteBrandUseCase(brandRepository);
const findAllBrandUseCase = new FindAllBrandUseCase(brandRepository);

export const brandController = new BrandController(
    createBrandUseCase,
    findByIdBrandUseCase,
    updateBrandUseCase,
    deleteBrandUseCase,
    findAllBrandUseCase
);