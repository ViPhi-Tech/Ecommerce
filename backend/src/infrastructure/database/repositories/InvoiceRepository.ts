import { Prisma, PrismaClient } from '../prismaClient';
import { Invoice } from '../../../domain/entities/Invoice';
import { IInvoiceRepository } from '../../../domain/repositories/IInvoiceRepository';
import { InvoiceItem } from '../../../domain/entities/InvoiceItem';

export class InvoiceRepository implements IInvoiceRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}

  async create(data: Invoice): Promise<Invoice> {
    const { clientId, orderId, ...restOfData } = data;
    const { items, ...restWithoutItems } = restOfData; 
    
    const dataForPrisma: Prisma.InvoiceUpdateInput = {
    ...restWithoutItems                               
  };

    if (clientId) {
      dataForPrisma.client = {
        connect: {
          id: clientId,
        },
      };
    }
    if (orderId) {
      if (typeof orderId === 'number' && orderId > 0) {
              dataForPrisma.order = {
        connect: {
          id: orderId,
        },
      };
      }
    }

    const invoice = await this.prisma.invoice.create({
      data: {
        ...restWithoutItems
      }
    });

    return invoice as Invoice;
  };

  async findById(id: number): Promise<Invoice | null> {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { client: true },
    });

    return invoice as Invoice
  };

  async findAll(): Promise<Invoice[]> {
    const invoices = await this.prisma.invoice.findMany({
      include: { client: true },
    });

    return invoices as Invoice[]
  };

  async update(id: number, data: Partial<Invoice>): Promise<Invoice> {
    // 1. Separa os IDs de relação do resto dos dados a serem atualizados.
    const { clientId, orderId, ...restOfData } = data;
    const { items, ...restWithoutItems } = restOfData;
    // 2. Prepara o objeto de dados para o Prisma.
    // Agora: restWithoutItems não tem mais 'items'
    const dataForPrisma: Prisma.InvoiceUpdateInput = {
      ...restWithoutItems
    };
    
    // 3. Se um novo clientId for fornecido, usa 'connect' para atualizar a relação.
    if (clientId) {
      dataForPrisma.client = { connect: { id: clientId } };
    }
    
    // 4. Se um novo orderId for fornecido, usa 'connect' para atualizar a relação.
    if (orderId) {
      dataForPrisma.order = { connect: { id: orderId } };
    }

    // 5. Chama o 'update' com o objeto formatado corretamente.
    return this.prisma.invoice.update({
      where: { id },
      data: dataForPrisma,
    });
  };

  async delete(id: number): Promise<void> {
    await this.prisma.invoice.delete({ where: { id } });
  };

  async createItems(invoiceId: number, data: InvoiceItem[]): Promise<InvoiceItem[]> {
    const newData = data.map(item =>({
      ...item,
      invoiceId
    }))
    await this.prisma.invoiceItem.createMany({
      data: newData
    })
    return this.findItemsByInvoiceID(invoiceId)
  };

  async findItemsByInvoiceID(invoiceId: number): Promise<InvoiceItem[]> {
    return await this.prisma.invoiceItem.findMany({
      where: {
        invoiceId
      }
    })
  }



}