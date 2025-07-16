import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const productSchemaDTO = z.object({
        name: z.string().min(1, { message: "Nome é obrigatório" }),
        ean: z.string().min(1, { message: "EAN é obrigatório" }),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        initialPrice: z.number().min(0, { message: "Preço inicial deve ser maior que zero" }),
        finalPrice: z.number().min(0, { message: "Preço final deve ser maior que zero" }),
        brand: z.string().optional(),
        image: z.string().optional(),
        sku: z.string().min(1, { message: "SKU é obrigatório" }),
        companyId: z.number().min(1, { message: "ID da tabela (company)" }),
})

export const productCreateSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    ean: z.string().min(1, { message: "EAN é obrigatório" }),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    initialPrice: z.number().min(0, { message: "Preço inicial deve ser maior que zero" }),
    finalPrice: z.number().min(0, { message: "Preço final deve ser maior que zero" }),
    brandId: z.number().optional(),
    image: z.string().optional(),
    sku: z.string().min(1, { message: "SKU é obrigatório" }),
    cost: z.number().optional(),
    companyId: z.number().min(1, { message: "ID da tabela (company)" }),
    categoryId: z.number().min(1, { message: "ID da tabela (category)" }),
    quantity: z.number().min(0),
});

export const productIDSchema = z.object({
    id: z.number().min(1, { message: "ID da tabela (product)" })
});
export const productIdMovimentSchema = z.object({
    productIds: z.string().min(1, { message: "ID da tabela (product)" }),
})

export const productUpdateSchema = z.object({
    id: z.number().min(1, { message: "ID da tabela (product)" }),
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    ean: z.string().min(1, { message: "EAN é obrigatório" }),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    initialPrice: z.number().min(0, { message: "Preço inicial deve ser maior que zero" }),
    finalPrice: z.number().min(0, { message: "Preço final deve ser maior que zero" }),
    brand: z.string().optional(),
    image: z.string().optional(),
    sku: z.string().min(1, { message: "SKU é obrigatório" }),
    cost: z.number().optional(),
})


export const productUpdateStockSchema = z.object({
    productId: z.number().min(1, { message: "ID da tabela (product)" }),
    quantity: z.number().min(1, { message: "Quantidade atualizada do produto" })
});


export const productCategorySchema = z.object({
    name: z.string().min(1, {message: "Nome da categoria"}),
    id: z.number().min(1, {message: "ID da categoria"}),
    isActive: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const movimentStockSchema = z.object({
    productId: z.number().min(1, { message: "ID da tabela (product)" }),
    quantity: z.number().min(1, { message: "Quantidade atualizada do produto" }),
    type: z.enum(["IN", "OUT"]),
    user: z.object({
        id: z.number().min(1, { message: "ID da tabela (user)" }),
        fullName: z.string().min(1, { message: "Nome do usuário" }),
    })
});


export const metricSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "A data deve estar no formato YYYY-MM-DD",
  }),
  type: z.enum(["IN", "OUT"]).optional().nullable(),
});

export const metricJsonSchema = zodToJsonSchema(metricSchema)
export const productUpdateStockJsonSchema = zodToJsonSchema(productUpdateStockSchema);
export const productIdJsonSchema= zodToJsonSchema(productIDSchema);
export const productIdMovimentJsonSchema = zodToJsonSchema(productIdMovimentSchema);
export const productJsonSchema = zodToJsonSchema(productSchemaDTO);
export const productCreateJsonSchema = zodToJsonSchema(productCreateSchema);
export const productUpdateJsonSchema = zodToJsonSchema(productUpdateSchema);

export type metricDTO = z.infer<typeof metricSchema>
export type ProductCreateDTO = z.infer<typeof productCreateSchema>;
export type ProductDTO = z.infer<typeof productSchemaDTO>;
export type ProductID = z.infer<typeof productIDSchema>;
export type ProductUpdateStock = z.infer<typeof productUpdateStockSchema>;
export type ProductIdMoviment = z.infer<typeof productIdMovimentSchema>;
export type ProductUpdateDTO = z.infer<typeof productCreateSchema>;