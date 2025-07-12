import { prisma } from "./prismaClient"
import type { Prisma } from "@prisma/client"
import type { ITransactionRunner } from "../../domain/repositories/ITransactionRunner"

export class PrismaTransactionRunner implements ITransactionRunner {
  async run<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx)
    })
  }
}
