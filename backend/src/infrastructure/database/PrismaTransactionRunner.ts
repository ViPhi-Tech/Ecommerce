import { prisma } from "./prismaClient";
import { Prisma } from '@prisma/client';

export class PrismaTransactionRunner {
  async run<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  }
}