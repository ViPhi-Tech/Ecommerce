import { PrismaClient, Prisma } from '../prismaClient';
import { PurchaseInvoice } from '../../../domain/entities/PurchaseInvoice';
import { PurchaseInvoiceItem } from '../../../domain/entities/PurchaseInvoiceItem';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/IPurchaseInvoiceRepository';

export class PurchaseInvoiceRepository implements IPurchaseInvoiceRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}

  async create(data: PurchaseInvoice): Promise<PurchaseInvoice> {
    const { items, ...invoiceData } = data;
    
    const invoice = await this.prisma.purchaseInvoice.create({
      data: {
        accessKey: invoiceData.accessKey,
        number: invoiceData.number,
        series: invoiceData.series,
        model: invoiceData.model,
        issueDate: invoiceData.issueDate,
        entryDate: invoiceData.entryDate,
        totalAmount: invoiceData.totalAmount,
        totalTax: invoiceData.totalTax,
        xmlRaw: invoiceData.xmlRaw,
        protocol: invoiceData.protocol,
        supplierId: invoiceData.supplierId,
      },
    });

    return {
      ...invoice,
      totalAmount: Number(invoice.totalAmount),
      totalTax: Number(invoice.totalTax),
    } as PurchaseInvoice;
  }

  async findById(id: number): Promise<PurchaseInvoice | null> {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) return null;

    return {
      ...invoice,
      totalAmount: Number(invoice.totalAmount),
      totalTax: Number(invoice.totalTax),
      items: invoice.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: item.discount ? Number(item.discount) : null,
        totalAmount: Number(item.totalAmount),
        icmsBase: item.icmsBase ? Number(item.icmsBase) : null,
        icmsValue: item.icmsValue ? Number(item.icmsValue) : null,
        icmsRate: item.icmsRate ? Number(item.icmsRate) : null,
        icmsStBase: item.icmsStBase ? Number(item.icmsStBase) : null,
        icmsStValue: item.icmsStValue ? Number(item.icmsStValue) : null,
        ipiValue: item.ipiValue ? Number(item.ipiValue) : null,
        ipiRate: item.ipiRate ? Number(item.ipiRate) : null,
        unitCost: (item as any).unitCost ? Number((item as any).unitCost) : null,
        unitTotalWithTax: (item as any).unitTotalWithTax ? Number((item as any).unitTotalWithTax) : null,
        totalCost: (item as any).totalCost ? Number((item as any).totalCost) : null,
        totalWithTax: (item as any).totalWithTax ? Number((item as any).totalWithTax) : null,
      })),
    } as PurchaseInvoice;
  }

  async findByAccessKey(accessKey: string): Promise<PurchaseInvoice | null> {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { accessKey },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) return null;

    return {
      ...invoice,
      totalAmount: Number(invoice.totalAmount),
      totalTax: Number(invoice.totalTax),
      items: invoice.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: item.discount ? Number(item.discount) : null,
        totalAmount: Number(item.totalAmount),
        icmsBase: item.icmsBase ? Number(item.icmsBase) : null,
        icmsValue: item.icmsValue ? Number(item.icmsValue) : null,
        icmsRate: item.icmsRate ? Number(item.icmsRate) : null,
        icmsStBase: item.icmsStBase ? Number(item.icmsStBase) : null,
        icmsStValue: item.icmsStValue ? Number(item.icmsStValue) : null,
        ipiValue: item.ipiValue ? Number(item.ipiValue) : null,
        ipiRate: item.ipiRate ? Number(item.ipiRate) : null,
        unitCost: (item as any).unitCost ? Number((item as any).unitCost) : null,
        unitTotalWithTax: (item as any).unitTotalWithTax ? Number((item as any).unitTotalWithTax) : null,
        totalCost: (item as any).totalCost ? Number((item as any).totalCost) : null,
        totalWithTax: (item as any).totalWithTax ? Number((item as any).totalWithTax) : null,
      })),
    } as PurchaseInvoice;
  }

  async findAll(): Promise<PurchaseInvoice[]> {
    const invoices = await this.prisma.purchaseInvoice.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invoices.map(invoice => ({
      ...invoice,
      totalAmount: Number(invoice.totalAmount),
      totalTax: Number(invoice.totalTax),
      items: invoice.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount: item.discount ? Number(item.discount) : null,
        totalAmount: Number(item.totalAmount),
        icmsBase: item.icmsBase ? Number(item.icmsBase) : null,
        icmsValue: item.icmsValue ? Number(item.icmsValue) : null,
        icmsRate: item.icmsRate ? Number(item.icmsRate) : null,
        icmsStBase: item.icmsStBase ? Number(item.icmsStBase) : null,
        icmsStValue: item.icmsStValue ? Number(item.icmsStValue) : null,
        ipiValue: item.ipiValue ? Number(item.ipiValue) : null,
        ipiRate: item.ipiRate ? Number(item.ipiRate) : null,
        unitCost: (item as any).unitCost ? Number((item as any).unitCost) : null,
        unitTotalWithTax: (item as any).unitTotalWithTax ? Number((item as any).unitTotalWithTax) : null,
        totalCost: (item as any).totalCost ? Number((item as any).totalCost) : null,
        totalWithTax: (item as any).totalWithTax ? Number((item as any).totalWithTax) : null,
      })),
    })) as PurchaseInvoice[];
  }

  async createItems(
    purchaseInvoiceId: number,
    items: PurchaseInvoiceItem[]
  ): Promise<PurchaseInvoiceItem[]> {
    const itemsToCreate = items.map((item: any) => ({
      purchaseInvoiceId,
      productId: item.productId ?? null,
      code: item.code || null,
      description: item.description,
      ncm: item.ncm,
      cst: item.cst || null,
      cfop: item.cfop,
      unit: item.unit || null,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount || null,
      totalAmount: item.totalAmount,
      icmsBase: item.icmsBase || null,
      icmsValue: item.icmsValue || null,
      icmsRate: item.icmsRate || null,
      icmsStBase: item.icmsStBase || null,
      icmsStValue: item.icmsStValue || null,
      ipiValue: item.ipiValue || null,
      ipiRate: item.ipiRate || null,
      unitCost: item.unitCost || null,
      unitTotalWithTax: item.unitTotalWithTax || null,
      totalCost: item.totalCost || null,
      totalWithTax: item.totalWithTax || null,
      taxData: item.taxData,
    }));

    await this.prisma.purchaseInvoiceItem.createMany({
      data: itemsToCreate,
    });

    return this.findItemsByPurchaseInvoiceId(purchaseInvoiceId);
  }

  async findItemsByPurchaseInvoiceId(
    purchaseInvoiceId: number
  ): Promise<PurchaseInvoiceItem[]> {
    const items = await this.prisma.purchaseInvoiceItem.findMany({
      where: {
        purchaseInvoiceId,
      },
      include: {
        product: true,
      },
    });

    return items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discount: item.discount ? Number(item.discount) : null,
      totalAmount: Number(item.totalAmount),
      icmsBase: item.icmsBase ? Number(item.icmsBase) : null,
      icmsValue: item.icmsValue ? Number(item.icmsValue) : null,
      icmsRate: item.icmsRate ? Number(item.icmsRate) : null,
      icmsStBase: item.icmsStBase ? Number(item.icmsStBase) : null,
      icmsStValue: item.icmsStValue ? Number(item.icmsStValue) : null,
      ipiValue: item.ipiValue ? Number(item.ipiValue) : null,
      ipiRate: item.ipiRate ? Number(item.ipiRate) : null,
      unitCost: (item as any).unitCost ? Number((item as any).unitCost) : null,
      unitTotalWithTax: (item as any).unitTotalWithTax ? Number((item as any).unitTotalWithTax) : null,
      totalCost: (item as any).totalCost ? Number((item as any).totalCost) : null,
      totalWithTax: (item as any).totalWithTax ? Number((item as any).totalWithTax) : null,
    }));
  }
}
