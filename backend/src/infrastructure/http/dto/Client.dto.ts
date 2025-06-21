import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const clientSchemaDTO = z.object({
  id: z.number().optional(),
  fullName: z.string().min(1, { message: 'Nome é obrigatório' }),
  document: z.string().min(1, { message: 'Documento é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  isActive: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const clientCreateSchema = z.object({
  fullName: z.string().min(1, { message: 'Nome é obrigatório' }),
  document: z.string().min(1, { message: 'Documento é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  isActive: z.boolean().optional(),
});

export const clientIDSchema = z.object({
  id: z.number().min(1, { message: 'ID do cliente é obrigatório' })
});

export const clientDocumentSchema = z.object({
  document: z.string().min(1, {message: 'Documento do cliente'})
});

export const clientUpdateSchema = z.object({
  id: z.number().min(1, { message: 'ID do cliente é obrigatório' }),
  fullName: z.string().min(1, { message: 'Nome é obrigatório' }),
  document: z.string().min(1, { message: 'Documento é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  isActive: z.boolean().optional(),
});

export const clientJsonSchema = zodToJsonSchema(clientSchemaDTO);
export const clientCreateJsonSchema = zodToJsonSchema(clientCreateSchema);
export const clientIdJsonSchema = zodToJsonSchema(clientIDSchema);
export const clientUpdateJsonSchema = zodToJsonSchema(clientUpdateSchema);
export const clientDocumentJsonSchema = zodToJsonSchema(clientDocumentSchema)


export type ClientDTO = z.infer<typeof clientSchemaDTO>;
export type ClientCreateDTO = z.infer<typeof clientCreateSchema>;
export type ClientID = z.infer<typeof clientIDSchema>;
export type ClientUpdateDTO = z.infer<typeof clientUpdateSchema>;
export type ClientDocument = z.infer<typeof clientDocumentSchema>;
