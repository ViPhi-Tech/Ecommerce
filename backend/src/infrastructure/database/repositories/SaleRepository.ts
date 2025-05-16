import { Sale } from "../../../domain/entities/Sale";
import { ISaleRepository } from "../../../domain/repositories/ISaleRepository";
import { PrismaClient, Prisma } from "@prisma/client";

export class SaleRepository implements ISaleRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Sale[]> {
    return this.prisma.sale.findMany({
        include: {
            items: true,
        },
    });
  }

  async findById(id: number): Promise<Sale | null> {
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async create(saleData: Partial<Sale>): Promise<Sale> {
    const { items, id, createdAt, updatedAt, ...restSaleData } = saleData;
    
    if (!items || items.length === 0) {
      throw new Error("Itens são obrigatórios para criar uma venda");
    }
    
    // Usar type assertion (as any) para contornar a verificação de tipos
    const result = await this.prisma.sale.create({
      data: {
        ...restSaleData,
        items: {
          create: items.map(({ id, saleId, createdAt, updatedAt, product, ...itemData }) => itemData)
        }
      } as any, // Usar 'as any' para contornar a verificação de tipos
      include: {
        items: true
      }
    });
    
    return result as Sale;
  }

  async update(id: number, saleData: Partial<Sale>): Promise<Sale> {
    const sale = await this.findById(id);
    
    if (!sale) {
      throw new Error(`Venda com ID ${id} não encontrada`);
    }
    
    const { items, id: _, createdAt, updatedAt, ...restSaleData } = saleData;
    
    const updatedSale = await this.prisma.sale.update({
      where: { id },
      data: restSaleData as any,
      include: { items: true }
    });
    
    return updatedSale as Sale;
  }

  async delete(id: number): Promise<void> {
    const sale = await this.findById(id);
    if (sale) {
      await this.prisma.sale.delete(
        {
            where: { id },
        }
      );
    }
  }
}