import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface UploadFileInput {
  file: any;
  folder?: string;
}

export interface DestroyFileInput {
  publicId: string;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const uploadFileSchema = z.object({
  file: z.any({
    required_error: 'O arquivo é obrigatório',
    invalid_type_error: 'Formato do arquivo inválido',
  }),
  folder: z.string().optional().default('uploads'),
});

export const destroyFileSchema = z.object({
  publicId: z.string({
    required_error: 'O campo public_id é obrigatório',
    invalid_type_error: 'public_id deve ser uma string válida',
  }).min(1, { message: 'O ID do arquivo não pode ser vazio' }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const uploadFileJsonSchema = zodToJsonSchema(uploadFileSchema);
export const destroyFileJsonSchema = zodToJsonSchema(destroyFileSchema);

// ===== TYPES (Para TypeScript) =====
export type UploadFileDTO = z.infer<typeof uploadFileSchema>;
export type DestroyFileDTO = z.infer<typeof destroyFileSchema>;

// ===== RESPONSE DTOs =====
export interface FileUploadResponse {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  folder: string;
  createdAt: Date;
}

export interface FileDestroyResponse {
  result: 'ok' | 'not found';
  publicId: string;
}