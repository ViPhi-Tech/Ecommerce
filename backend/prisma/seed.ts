import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcrypt'

// Essential data the system needs to work (idempotent: safe to run many times).
// Mock/demo data lives in seed-mock.ts.

const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

// Must match frontend-admin/src/app/shared/constants/roles.sitemap.ts
const ROLES = [
    { uuid: '3f29a6d2-4e71-4f0a-8c0d-6b2f9e1c4a11', nome: 'Dashboard' },
    { uuid: 'e4f5a6b7-c8d9-4e0f-8a1b-2c3d4e5f6a24', nome: 'Agendamentos' },
    { uuid: '7c5d2b0a-8f34-4e1e-9a2b-3d6f7b2c9d12', nome: 'Produtos' },
    { uuid: 'a1e6b3c4-2f5d-4a7b-8c1d-5e6f7a8b9c13', nome: 'Categorias' },
    { uuid: 'f0d1a2b3-4c5e-6f7a-8b9c-1d2e3f4a5b14', nome: 'Clientes' },
    { uuid: '9b8c7d6e-5f4a-3b2c-1d0e-7f6a5b4c3d15', nome: 'Fornecedores' },
    { uuid: '2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c16', nome: 'Pedidos' },
    { uuid: '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b17', nome: 'Movimentação de Estoque' },
    { uuid: 'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e18', nome: 'Contas a Pagar' },
    { uuid: '8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c19', nome: 'Contas a Receber' },
    { uuid: '6d7e8f9a-0b1c-2d3e-4f5a-6b7c8d9e0f22', nome: 'Dívidas' },
    { uuid: '4b5c6d7e-8f9a-0b1c-2d3e-4f5a6b7c8d20', nome: 'Relatórios' },
    { uuid: '1c2d3e4f-5a6b-7c8d-9e0f-1b2c3d4e5f21', nome: 'Usuários' },
    { uuid: 'a2b3c4d5-6e7f-8a9b-0c1d-2e3f4a5b6c23', nome: 'Entregas' },
]

// Must match frontend-admin/src/app/shared/constants/payments.sitemap.ts
const PAYMENT_TYPES = [
    { name: 'pix', label: 'PIX' },
    { name: 'card', label: 'Cartão de Crédito/Débito' },
    { name: 'money', label: 'Dinheiro' },
    { name: 'account_receivable', label: 'Pedido anotado' },
]

// "pending" is required: orders create payments with statusId = "pending"
const PAYMENT_STATUSES = [
    { name: 'pending', label: 'Pendente' },
    { name: 'completed', label: 'Concluído' },
    { name: 'failed', label: 'Falhou' },
    { name: 'refunded', label: 'Estornado' },
]

async function seedRoles() {
    for (const role of ROLES) {
        await prisma.role.upsert({
            where: { uuid: role.uuid },
            update: { nome: role.nome },
            create: role,
        })
    }
    console.log(`✔ ${ROLES.length} roles`)
}

async function seedPaymentTypes() {
    for (const type of PAYMENT_TYPES) {
        await prisma.paymentType.upsert({
            where: { name: type.name },
            update: { label: type.label },
            create: type,
        })
    }
    console.log(`✔ ${PAYMENT_TYPES.length} tipos de pagamento`)
}

async function seedPaymentStatuses() {
    for (const status of PAYMENT_STATUSES) {
        await prisma.paymentStatus.upsert({
            where: { name: status.name },
            update: { label: status.label },
            create: status,
        })
    }
    console.log(`✔ ${PAYMENT_STATUSES.length} status de pagamento`)
}

// Creates the first admin user with all roles, only when
// SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are set.
async function seedAdminUser() {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    const fullName = process.env.SEED_ADMIN_NAME || 'Administrador'

    if (!email || !password) {
        console.log('ℹ Admin não criado (defina SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD)')
        return
    }

    let login = await prisma.login.findUnique({ where: { email } })
    if (!login) {
        login = await prisma.login.create({
            data: { email, hashedPassword: await bcrypt.hash(password, 10) },
        })
    }

    let user = await prisma.user.findUnique({ where: { loginId: login.id } })
    if (!user) {
        user = await prisma.user.create({ data: { fullName, loginId: login.id } })
    }

    const existing = await prisma.userRole.findMany({
        where: { userId: user.id },
        select: { roleId: true },
    })
    const existingIds = new Set(existing.map((r) => r.roleId))
    const missing = ROLES.filter((r) => !existingIds.has(r.uuid))

    if (missing.length > 0) {
        await prisma.userRole.createMany({
            data: missing.map((r) => ({ userId: user!.id, roleId: r.uuid })),
        })
    }

    console.log(`✔ admin ${email} (${missing.length} roles adicionadas)`)
}

async function main() {
    await seedRoles()
    await seedPaymentTypes()
    await seedPaymentStatuses()
    await seedAdminUser()
    console.log('✅ Seed essencial executado com sucesso!')
}

main()
    .catch((e) => {
        console.error('Erro ao executar seed:', e)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
