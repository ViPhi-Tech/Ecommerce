import 'dotenv/config'
import { PrismaClient, Prisma, $Enums } from '../../generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
export type PrismaTx = Prisma.TransactionClient

// Re-exportar tipos para uso em outros arquivos
export { PrismaClient, Prisma, $Enums }
// Tipos específicos podem ser acessados via:
// - Models: Prisma.ProductGetPayload<{}>
// - Enums: $Enums.PartnerType