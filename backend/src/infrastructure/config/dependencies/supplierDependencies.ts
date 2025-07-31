import { prisma } from "../../database/prismaClient";
import { CreateSupplierUseCase } from "../../../application/use-cases/supplier/CreateSupplierUseCase";
import { FindByIdSupplierUseCase } from "../../../application/use-cases/supplier/FindByIdSupplierUseCase";
import { DeleteSupplierUseCase } from "../../../application/use-cases/supplier/DeleteSupplierUseCase";
import { SupplierRepository } from "../../database/repositories/SupplierRepository";
import { UpdateSupplierUseCase } from "../../../application/use-cases/supplier/UpdateSupplierUseCase";
import { FindAllSupplierUseCase } from "../../../application/use-cases/supplier/FindAllSupplierUseCase";
import { SupplierController } from "../../http/controllers/SupplierController";

export const supplierRepository = new SupplierRepository(prisma);

const createSupplierUseCase = new CreateSupplierUseCase(supplierRepository);
const findByIdSupplierUseCase = new FindByIdSupplierUseCase(supplierRepository);
const updateSupplierUseCase = new UpdateSupplierUseCase(supplierRepository);
const deleteSupplierUseCase = new DeleteSupplierUseCase(supplierRepository);
const findAllSupplierUseCase = new FindAllSupplierUseCase(supplierRepository);

export const supplierController = new SupplierController(
    createSupplierUseCase,
    findByIdSupplierUseCase,
    updateSupplierUseCase,
    deleteSupplierUseCase,
    findAllSupplierUseCase
);