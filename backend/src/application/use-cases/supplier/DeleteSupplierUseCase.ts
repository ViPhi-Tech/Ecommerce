import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";

export class DeleteSupplierUseCase {
  constructor(
    private supplierRepository: ISupplierRepository
  ) {

  }
  async execute(id: string): Promise<void> {
    // Verificar se o supplier existe
    const existingSupplier = await this.supplierRepository.findById(id);
    if (!existingSupplier) {
      throw new Error('Fornecedor não encontrado');
    }

    await this.supplierRepository.delete(id);
  }
}