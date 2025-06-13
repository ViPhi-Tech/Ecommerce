import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Schema para upload de arquivo
export const uploadFileSchemaDTO = z.object({
  file: z.any({
    required_error: 'O arquivo é obrigatório',
    invalid_type_error: 'Formato do arquivo inválido',
  }),
  folder: z.string().optional().default('uploads'),
});

// Schema para exclusão de arquivo
export const destroyFileSchemaDTO = z.object({
  publicId: z.string({
    required_error: 'O campo public_id é obrigatório',
    invalid_type_error: 'public_id deve ser uma string válida',
  }).min(1, 'O ID do arquivo não pode ser vazio'),
});

// Conversão para JSON Schema com nome explícito
export const uploadFileJsonSchema = zodToJsonSchema(uploadFileSchemaDTO);
export const destroyFileJsonSchema = zodToJsonSchema(destroyFileSchemaDTO);

// Exportação dos tipos para uso no código
export type UploadFileDTO = z.infer<typeof uploadFileSchemaDTO>;
export type DestroyFileDTO = z.infer<typeof destroyFileSchemaDTO>;