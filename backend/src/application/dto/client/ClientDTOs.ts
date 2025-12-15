import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateClientInput {
  fullName: string;
  document: string;
  email: string;
  phone: string;
  isActive?: boolean;
  // Campos de endereço
  street?: string;
  number?: string;
  neighborhood?: string; // Será mapeado para complement
  zipCode?: string;
  city?: string;
  state?: string;
}

export interface UpdateClientInput {
  fullName: string;
  document: string;
  email: string;
  phone: string;
  isActive?: boolean;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createClientSchema = z.object({
  fullName: z.string().min(1, { message: 'Nome é obrigatório' }),
  document: z.string().min(1, { message: 'Documento é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  isActive: z.boolean().optional().default(true),
  // Campos de endereço (opcionais)
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const updateClientSchema = z.object({
  fullName: z.string().min(1, { message: 'Nome é obrigatório' }),
  document: z.string().min(1, { message: 'Documento é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(1, { message: 'Telefone é obrigatório' }),
  isActive: z.boolean().optional(),
});

export const clientIdSchema = z.object({
  id: z.number().min(1, { message: 'ID do cliente é obrigatório' })
});

export const clientDocumentSchema = z.object({
  document: z.string().min(1, { message: 'Documento do cliente é obrigatório' })
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createClientJsonSchema = zodToJsonSchema(createClientSchema);
export const updateClientJsonSchema = zodToJsonSchema(updateClientSchema);
export const clientIdJsonSchema = zodToJsonSchema(clientIdSchema);
export const clientDocumentJsonSchema = zodToJsonSchema(clientDocumentSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateClientDTO = z.infer<typeof createClientSchema>;
export type UpdateClientDTO = z.infer<typeof updateClientSchema>;
export type ClientIdDTO = z.infer<typeof clientIdSchema>;
export type ClientDocumentDTO = z.infer<typeof clientDocumentSchema>;

// ===== RESPONSE DTOs =====
export interface ClientResponse {
  id: number;
  fullName: string;
  document: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}