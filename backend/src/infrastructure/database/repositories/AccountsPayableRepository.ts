import { PrismaClient } from '../prismaClient';
import {
  AccountsPayableListFilter,
  IAccountsPayableRepository,
} from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { CreateAccountsPayableInput, UpdateAccountsPayableInput } from '../../../application/dto/accountsPayable/AccountsPayableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';

export class AccountsPayableRepository implements IAccountsPayableRepository {
  constructor(private prisma: PrismaClient) { }

  async create(data: CreateAccountsPayableInput): Promise<AccountsPayable> {
    return await this.prisma.accountsPayable.create({
      data: {
        supplierId: data.supplierId!,
        // originalDueDate: parseDate(data.originalDueDate),
        issueDate: parseDate(data.issueDate),
        dueDate: parseDate(data.dueDate),
        // competenceDate: parseDate(data.competenceDate),
        amount: data.amount,
        recurringPurchase: data.recurringPurchase ?? false,
        description: data.description ?? '',
        status: data.status ?? 'pending',
      },
    });
  }

  async findAll(filter?: AccountsPayableListFilter): Promise<AccountsPayable[]> {
    const where: {
      dueDate?: { gte: Date; lte: Date };
      status?: string;
    } = {};

    if (filter?.dueDateRange) {
      where.dueDate = {
        gte: filter.dueDateRange.dueDateFrom,
        lte: filter.dueDateRange.dueDateTo,
      };
    }

    if (filter?.status && filter.status !== 'all') {
      where.status = filter.status;
    }

    const hasWhere = Object.keys(where).length > 0;

    return await this.prisma.accountsPayable.findMany({
      where: hasWhere ? where : undefined,
      include: {
        supplier: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findById(id: number): Promise<AccountsPayable | null> {
    return await this.prisma.accountsPayable.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });
  }

  async findBySupplierId(supplierId: number): Promise<AccountsPayable[]> {
    return await this.prisma.accountsPayable.findMany({
      where: { supplierId },
      include: {
        supplier: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByStatus(status: string): Promise<AccountsPayable[]> {
    return await this.prisma.accountsPayable.findMany({
      where: { status },
      include: {
        supplier: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOverdue(): Promise<AccountsPayable[]> {
    const today = new Date();
    return await this.prisma.accountsPayable.findMany({
      where: {
        dueDate: {
          lt: today,
        },
        status: {
          not: 'paid',
        },
      },
      include: {
        supplier: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async update(id: number, data: UpdateAccountsPayableInput): Promise<AccountsPayable> {
    const updateData: any = {};

    if (data.supplierId !== undefined) updateData.supplierId = data.supplierId;
    // if (data.originalDueDate !== undefined) updateData.originalDueDate = parseDate(data.originalDueDate);
    if (data.issueDate !== undefined) updateData.issueDate = parseDate(data.issueDate);
    if (data.dueDate !== undefined) updateData.dueDate = parseDate(data.dueDate);
    // if (data.competenceDate !== undefined) updateData.competenceDate = parseDate(data.competenceDate);
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.recurringPurchase !== undefined) updateData.recurringPurchase = data.recurringPurchase;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    return await this.prisma.accountsPayable.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.accountsPayable.delete({
      where: { id },
    });
  }
}