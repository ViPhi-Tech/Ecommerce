import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";
import { Supplier } from "../../../domain/entities/Supplier";

export class FindAllSupplierUseCase {
  constructor(
    private supplierRepository: ISupplierRepository
  ) {

  }
  async execute(): Promise<Supplier[]> {
    return await this.supplierRepository.findAll();
  }
}