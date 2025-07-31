import { SupplierUpdateDTO } from "../../dto/supplier/Supplier.dto";
import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";
import { Supplier } from "../../../domain/entities/Supplier";

export class UpdateSupplierUseCase {
  constructor(
    private supplierRepository: ISupplierRepository
  ) {

  }
  async execute(id: string, input: SupplierUpdateDTO): Promise<Supplier> {
    // Verificar se o supplier existe
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new Error('Fornecedor não encontrado');
    }

    // Se está tentando alterar o CNPJ, verificar se não existe outro supplier com o mesmo CNPJ
    if (input.cnpj && input.cnpj !== existingSupplier.cnpj) {
      const supplierWithSameCnpj = await this.supplierRepository.findByCnpj(input.cnpj);
      if (supplierWithSameCnpj) {
        throw new Error('Já existe um fornecedor com este CNPJ');
      }
    }

    return await this.supplierRepository.update(id, input);
  }
}