import 'dotenv/config'
import { PrismaClient } from '../src/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Cria uma empresa
    const company = await prisma.company.create({
        data: {
            fullName: "Nova Empresa Inovadora",
            document: "1255667788990031",
        },
    })

    // Cria um login e usuário do sistema
    const loginUser = await prisma.login.create({
        data: {
            email: "adadmin@inovadora2.com",
            hashedPassword: "$2b$10$abcabcabcabcabcabcabcOeVJjG7Xp9W5/xyz", // nova hash fictícia
        },
    })

    const user = await prisma.user.create({
        data: {
            fullName: "Maria Administradora",
            login: { connect: { id: loginUser.id } },
            company: { connect: { id: company.id } },
            address: {
                create: {  // Adicionando endereço para o usuário
                    street: "Rua das Flores",
                    number: "100",
                    city: "São Paulo",
                    state: "SP",
                    zipCode: "01010-100",
                },
            },
        },
    })

    // Cria um cliente com login e endereço
    const loginClient = await prisma.login.create({
        data: {
            email: "adcliente.novo@t3este.com",
            hashedPassword: "$2b$10$abcabcabcabcabcabcabcOeVJjG7Xp9W5/xyz",
        },
    })

    const client = await prisma.client.create({
        data: {
            fullName: "Carlos Cliente",
            email: "adcliente.novo@te3ste.com",
            phone: "11988884444",
            document: "121233211230022",
            login: { connect: { id: loginClient.id } },
            address: {  // Adicionando endereço para o cliente
                create: {
                    street: "Rua dos Clientes",
                    number: "500",
                    city: "São Paulo",
                    state: "SP",
                    zipCode: "01020-200",
                },
            },
        },
    })

    // Cria 15 produtos
    const produtos = await Promise.all(
        Array.from({ length: 15 }).map((_, i) =>
            prisma.product.create({
                data: {
                    name: `Item Especial ${i + 1}`,
                    sku: `AESPC${1000 + i}`,
                    initialPrice: Number((Math.random() * 120 + 15).toFixed(2)),
                    finalPrice: Number((Math.random() * 100 + 10).toFixed(2)),
                    cost: Number((Math.random() * 60 + 10).toFixed(2)),
                    quantity: Math.floor(Math.random() * 80) + 1,
                    company: { connect: { id: company.id } },
                },
            })
        )
    )

    // Cria uma venda com 3 itens
    const sale = await prisma.order.create({
        data: {
            total: produtos.slice(0, 3).reduce((acc, p) => acc + p.finalPrice, 0),
            client: { connect: { id: client.id } },
            items: {
                create: produtos.slice(0, 3).map((p) => ({
                    product: { connect: { id: p.id } },
                    quantity: 1 + Math.floor(Math.random() * 2),
                    price: p.initialPrice,
                })),
            },
        },
    })

    // Cria 5 parceiros com endereços
    const partners = await Promise.all(
        Array.from({ length: 5 }).map((_, i) =>
            prisma.partner.create({
                data: {
                    name: `Distribuidor ${i + 1}`,
                    document: `1239988776655${i}`,
                    phone: `1199000111${i}`,
                    email: `addistribuidor${i + 1}@fornece2dor.com`,
                    address: {
                        create: {
                            street: `Avenida Central ${i + 1}`,
                            number: `${200 + i}`,
                            city: "Rio de Janeiro",
                            state: "RJ",
                            zipCode: `2000${i}-100`
                        }
                    }
                }
            })
        )
    )

    console.log("✅ Seed executado com sucesso!")
}

main()
    .catch((e) => {
        console.error("Erro ao executar seed:", e)
    })
    .finally(() => {
        prisma.$disconnect()
    })
