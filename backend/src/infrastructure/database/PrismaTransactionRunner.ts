import { prisma } from "./prismaClient"
import type { Prisma } from "@prisma/client"
import type { ITransactionRunner } from "../../domain/repositories/ITransactionRunner"

export class PrismaTransactionRunner implements ITransactionRunner {
  async run<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx)
    }, {
      maxWait: 10000, // Tempo máximo de espera para iniciar a transação (10 segundos)
      timeout: 30000, // Timeout da transação (30 segundos)
    })
  }
}
