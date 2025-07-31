import { SupplierCreateDTO } from "../../dto/supplier/Supplier.dto";
import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";

export class CreateSupplierUseCase {
  constructor(
    private supplierRepository: ISupplierRepository
  ) {

  }
  async execute(input: SupplierCreateDTO): Promise<SupplierCreateDTO> {
    // Verificar se já existe um supplier com o mesmo CNPJ
    const existingSupplier = await this.supplierRepository.findByCnpj(input.cnpj);
    if (existingSupplier) {
      throw new Error('Já existe um fornecedor com este CNPJ');
    }

    return await this.supplierRepository.create({
      tradeName: input.tradeName,
      legalName: input.legalName,
      cnpj: input.cnpj,
      address: input.address,
      email: input.email,
      phone: input.phone,
    });
  }
}