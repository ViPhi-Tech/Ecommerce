import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const productSchemaDTO = z.object({
        name: z.string().min(1, { message: "Nome é obrigatório" }),
        ean: z.string().min(1, { message: "EAN é obrigatório" }),
        description: z.string().optional(),
        price: z.number().min(0, { message: "Preço deve ser maior que zero" }),
        sku: z.string().min(1, { message: "SKU é obrigatório" }),
        companyId: z.number().min(1, { message: "ID da tabela (company)" }),
})

export const productCreateSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    ean: z.string().min(1, { message: "EAN é obrigatório" }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Preço deve ser maior que zero" }),
    sku: z.string().min(1, { message: "SKU é obrigatório" }),
    cost: z.number().optional(),
    companyId: z.number().min(1, { message: "ID da tabela (company)" }),
});

export const productIDSchema = z.object({
    id: z.number().min(1, { message: "ID da tabela (product)" })
});


export const productUpdateSchema = z.object({
    id: z.number().min(1, { message: "ID da tabela (product)" }),
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    ean: z.string().min(1, { message: "EAN é obrigatório" }),
    description: z.string().optional(),
    price: z.number().min(0, { message: "Preço deve ser maior que zero" }),
    sku: z.string().min(1, { message: "SKU é obrigatório" }),
    cost: z.number().optional(),
})


export const productUpdateStockSchema = z.object({
    companyId: z.number().min(1, { message: "ID da tabela (company)" }).optional(),
    productId: z.number().min(1, { message: "ID da tabela (product)" }),
    quantity: z.number().min(1, { message: "Quantidade atualizada do produto" })
});


export const productCategorySchema = z.object({
    name: z.string().min(1, {message: "Nome da categoria"})
});

export const productUpdateStockJsonSchema = zodToJsonSchema(productUpdateStockSchema);
export const productIdJsonSchema= zodToJsonSchema(productIDSchema);
export const productJsonSchema = zodToJsonSchema(productSchemaDTO);
export const productCreateJsonSchema = zodToJsonSchema(productCreateSchema);
export const productUpdateJsonSchema = zodToJsonSchema(productUpdateSchema);

export type ProductCreateDTO = z.infer<typeof productCreateSchema>;
export type ProductDTO = z.infer<typeof productSchemaDTO>;
export type ProductID = z.infer<typeof productIDSchema>;
export type ProductUpdateStock = z.infer<typeof productUpdateStockSchema>