import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';


export const partnerSchemaDTO = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    document: z.string().optional(),
    type: z.enum(['RESELLER', 'DISTRIBUTOR', 'SUPPLIER']).default('RESELLER'), // ajuste os valores conforme seu enum
    active: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
    address: z.object({
        street: z.string().min(1, { message: 'Rua é um campo obrigatório'}),
        number: z.string().min(1, { message: 'Número é um campo obrigatório'}),
        city: z.string().min(1, { message: 'Cidade é um campo obrigatório'}),
        state: z.string().min(1, { message: 'Estado é um campo obrigatório'}),
        zipCode: z.string().min(1, { message: 'CEP é um campo obrigatório'}),
        complement: z.string().optional()
    }).optional()
});


export const partnerJsonSchema = zodToJsonSchema(partnerSchemaDTO);

export type PartnerDto = z.infer<typeof partnerSchemaDTO>;