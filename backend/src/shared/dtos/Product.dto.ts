import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export type ProductDTO = {
    id: number,
    name: string,
    ean: string,
    description?: string,
    cost?: number,
    price: number,
    sku?: string,
    stock?: number,
}


// Definindo o schema de validação com Zod
export const productCreateSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    ean: z.string().min(1, { message: "EAN é obrigatório" }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Preço deve ser maior que zero" }),
    sku: z.string().min(1, { message: "SKU é obrigatório" }),
    cost: z.number().optional(),
    companyId: z.number().min(1, { message: "ID da tabela (company)" }),
});

export const productCreateJsonSchema = zodToJsonSchema(productCreateSchema);
export type ProductCreateDTO = z.infer<typeof productCreateSchema>;