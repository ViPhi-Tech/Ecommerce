import { PrismaClient } from '@prisma/client';
import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { CreateAccountsPayableInput, UpdateAccountsPayableInput } from '../../../application/dto/accountsPayable/AccountsPayableDTOs';

export class AccountsPayableRepository implements IAccountsPayableRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateAccountsPayableInput): Promise<AccountsPayable> {
    return await this.prisma.accountsPayable.create({
      data: {
        supplierId: data.supplierId!,
        originalDueDate: new Date(data.originalDueDate),
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        competenceDate: new Date(data.competenceDate),
        amount: data.amount,
        recurringPurchase: data.recurringPurchase ?? false,
        description: data.description,
        status: data.status ?? 'pending',
      },
    });
  }

  async findAll(): Promise<AccountsPayable[]> {
    return await this.prisma.accountsPayable.findMany({
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
    if (data.originalDueDate !== undefined) updateData.originalDueDate = new Date(data.originalDueDate);
    if (data.issueDate !== undefined) updateData.issueDate = new Date(data.issueDate);
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
    if (data.competenceDate !== undefined) updateData.competenceDate = new Date(data.competenceDate);
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