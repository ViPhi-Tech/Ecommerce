import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";
import { Supplier } from "../../../domain/entities/Supplier";

export class FindByIdSupplierUseCase {
  constructor(
    private supplierRepository: ISupplierRepository
  ) {

  }
  async execute(id: string): Promise<Supplier | null> {
    return await this.supplierRepository.findById(id);
  }
}