import { PrismaClient } from '@prisma/client';
import { IAccountsPayableRepository } from '../../../domain/repositories/IAccountsPayableRepository';
import { AccountsPayable } from '../../../domain/entities/AccountsPayable';
import { AccountsPayableCreateDTO, AccountsPayableUpdateDTO } from '../../../application/dto/accounts-payable/AccountsPayable.dto';

export class AccountsPayableRepository implements IAccountsPayableRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: AccountsPayableCreateDTO): Promise<AccountsPayable> {
    return await this.prisma.accountsPayable.create({
      data: {
        supplierId: data.supplierId,
        originalDueDate: data.originalDueDate,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        competenceDate: data.competenceDate,
        amount: data.amount,
        recurringPurchase: data.recurringPurchase ?? false,
        description: data.description,
        status: data.status,
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

  async update(id: number, data: AccountsPayableUpdateDTO): Promise<AccountsPayable> {
    return await this.prisma.accountsPayable.update({
      where: { id },
      data,
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