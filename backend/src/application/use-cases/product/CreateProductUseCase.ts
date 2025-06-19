import { CreateProductInput } from "../../dto/product/CreateProductInput";
import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { UpdateStockUseCase } from "./UpdateStockUseCase";


export class CreateProductUseCase {
  constructor(
      private productRepository: IProductRepository,
      private updateStockUseCase: UpdateStockUseCase
  ) {

  }
  async execute(input: CreateProductInput): Promise<ProductResponse> {
    try {
      const createdProduct =  await this.productRepository.create({
          name:input.name,
          ean:input.ean,
          initialPrice:input.initialPrice,
          finalPrice: input.finalPrice,
          brand: input.brand,
          sku:input.sku,
          companyId: input.companyId ?? null,
          categoryId: input.categoryId ?? null,
          quantity: input.quantity
        });
        
        await this.updateStockUseCase.execute({
          productId: createdProduct?.id ?? 0,
          quantity: input?.quantity ?? 0,
          companyId: input.companyId ?? undefined,
          user: input.user ?? undefined
        });
        
        // Busca o produto novamente com o stock incluído
        const productWithStock = await this.productRepository.findById(createdProduct.id!);
        
        return productWithStock || createdProduct;

    } catch (error: any) {
      console.log('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack
      });
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        throw new Error('Produto com SKU ou EAN já existe');
      }
      
      if (error.code === 'P2003') {
        throw new Error('Categoria ou empresa não encontrada');
      }
      
      throw new Error(error.message || 'Erro interno do servidor');
    }
  }
}