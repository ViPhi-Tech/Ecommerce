import { PrismaClient } from '@prisma/client';
import { IAccountsReceivableRepository } from '../../../domain/repositories/IAccountsReceivableRepository';
import { AccountsReceivable } from '../../../domain/entities/AccountsReceivable';
import { CreateAccountsReceivableInput, UpdateAccountsReceivableInput } from '../../../application/dto/accountsReceivable/AccountsReceivableDTOs';
import { parseDate } from '../../../shared/utils/dateUtils';

export class AccountsReceivableRepository implements IAccountsReceivableRepository {
  constructor(private prisma: PrismaClient) { }

  async create(data: CreateAccountsReceivableInput): Promise<AccountsReceivable> {
    return await this.prisma.accountsReceivable.create({
      data: {
        clientId: data.clientId!,
        // originalDueDate: parseDate(data.originalDueDate),
        issueDate: parseDate(data.issueDate),
        dueDate: parseDate(data.dueDate),
        // competenceDate: parseDate(data.competenceDate),
        amount: data.amount,
        recurringIncome: data.recurringIncome ?? false,
        description: data.description,
        status: data.status ?? 'pending',
      },
    });
  }

  async findAll(): Promise<AccountsReceivable[]> {
    return await this.prisma.accountsReceivable.findMany({
      include: {
        client: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findById(id: number): Promise<AccountsReceivable | null> {
    return await this.prisma.accountsReceivable.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });
  }

  async findByClientId(clientId: number): Promise<AccountsReceivable[]> {
    return await this.prisma.accountsReceivable.findMany({
      where: { clientId },
      include: {
        client: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByStatus(status: string): Promise<AccountsReceivable[]> {
    return await this.prisma.accountsReceivable.findMany({
      where: { status },
      include: {
        client: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOverdue(): Promise<AccountsReceivable[]> {
    const today = new Date();
    return await this.prisma.accountsReceivable.findMany({
      where: {
        dueDate: {
          lt: today,
        },
        status: {
          not: 'received',
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async update(id: number, data: UpdateAccountsReceivableInput): Promise<AccountsReceivable> {
    const updateData: any = {};

    if (data.clientId !== undefined) updateData.clientId = data.clientId;
    // if (data.originalDueDate !== undefined) updateData.originalDueDate = parseDate(data.originalDueDate);
    if (data.issueDate !== undefined) updateData.issueDate = parseDate(data.issueDate);
    if (data.dueDate !== undefined) updateData.dueDate = parseDate(data.dueDate);
    // if (data.competenceDate !== undefined) updateData.competenceDate = parseDate(data.competenceDate);
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.recurringIncome !== undefined) updateData.recurringIncome = data.recurringIncome;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    return await this.prisma.accountsReceivable.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.accountsReceivable.delete({
      where: { id },
    });
  }
}
