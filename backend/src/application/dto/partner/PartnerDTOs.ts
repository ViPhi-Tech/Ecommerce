import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreatePartnerInput {
  name: string;
  email: string;
  document: string;
  phone: string;
  type: "RESELLER" | "DISTRIBUTOR" | "AFFILIATE" | "AGENT" | "OTHER";
}

export interface UpdatePartnerInput {
  name: string;
  email: string;
  document: string;
  phone: string;
  type: "RESELLER" | "DISTRIBUTOR" | "AFFILIATE" | "AGENT" | "OTHER";
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createPartnerSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  document: z.string().min(1, { message: "Documento é obrigatório" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }),
  type: z.enum(["RESELLER", "DISTRIBUTOR", "AFFILIATE", "AGENT", "OTHER"], {
    required_error: "Tipo é obrigatório",
    invalid_type_error: "Tipo de parceiro inválido",
  }),
});

export const updatePartnerSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  document: z.string().min(1, { message: "Documento é obrigatório" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }),
  type: z.enum(["RESELLER", "DISTRIBUTOR", "AFFILIATE", "AGENT", "OTHER"]),
});

export const partnerIdSchema = z.object({
  id: z.number().min(1, { message: "ID do parceiro é obrigatório" }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createPartnerJsonSchema = zodToJsonSchema(createPartnerSchema);
export const updatePartnerJsonSchema = zodToJsonSchema(updatePartnerSchema);
export const partnerIdJsonSchema = zodToJsonSchema(partnerIdSchema);

// ===== TYPES (Para TypeScript) =====
export type CreatePartnerDTO = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerDTO = z.infer<typeof updatePartnerSchema>;
export type PartnerIdDTO = z.infer<typeof partnerIdSchema>;

// ===== RESPONSE DTOs =====
export interface PartnerResponse {
  id: number;
  name: string;
  email: string;
  document: string;
  phone: string;
  type: "RESELLER" | "DISTRIBUTOR" | "AFFILIATE" | "AGENT" | "OTHER";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}