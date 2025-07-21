import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const invoiceIdSchema = z.object({
  id: z.number().int(),
});

export const invoiceItemJsonSchema = z.object({
  productId: z.number().int(),
  quantity: z.number().int(),
  price: z.number(),
  totalAmount: z.number(),
});


export const invoiceCreateJsonSchema = z.object({
  number: z.string().min(1, {'message': 'Número da fatura é obrigatório'}).default('1234'),
  series: z.string().default('100'),    
  status: z.string(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(), 
  totalAmount: z.number(),
  taxAmount: z.number(),  
  clientId: z.number().int().nullable().optional(),
  orderId: z.preprocess(
    (input) => {
      if (input === "" || input === null || input === undefined || input === 0) {
        return null;
      }
      return Number(input);
    },
    z.number().int().nullable()
  ), 
  
  items: z.array(invoiceItemJsonSchema)
});


export const invoiceUpdateJsonSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  series: z.string(),
  status: z.string(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().nullable().optional(),
  totalAmount: z.number(),
  taxAmount: z.number().nullable().optional(),
  clientId: z.number().int().nullable().optional(),
  orderId: z.number().int(),
});

export const invoiceJsonSchema = zodToJsonSchema(invoiceCreateJsonSchema);
export const invoiceIdJsonSchema = zodToJsonSchema(invoiceIdSchema)
export const invoiceUpdateJsonSchemaZod = zodToJsonSchema(invoiceUpdateJsonSchema);

export type InvoiceCreateDTO = z.infer<typeof invoiceCreateJsonSchema>;
export type InvoiceUpdateDTO = z.infer<typeof invoiceUpdateJsonSchema>;
export type InvoiceID = z.infer<typeof invoiceIdSchema>;