import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateLoginInput {
  email: string;
  googleId?: string;
  hashedPassword?: string | null;
}

export interface UpdateLoginInput {
  email?: string;
  googleId?: string;
  password?: string;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createLoginSchema = z.object({
  email: z.string().email({ message: 'Email deve ter um formato válido' }),
  googleId: z.string().optional(),
  hashedPassword: z.string().nullable().optional(),
});

export const updateLoginSchema = z.object({
  email: z.string().email({ message: 'Email deve ter um formato válido' }).optional(),
  googleId: z.string().optional(),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }).optional(),
});

export const loginIdSchema = z.object({
  id: z.number().int({ message: 'ID deve ser um número inteiro' }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createLoginJsonSchema = zodToJsonSchema(createLoginSchema);
export const updateLoginJsonSchema = zodToJsonSchema(updateLoginSchema);
export const loginIdJsonSchema = zodToJsonSchema(loginIdSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateLoginDTO = z.infer<typeof createLoginSchema>;
export type UpdateLoginDTO = z.infer<typeof updateLoginSchema>;
export type LoginIdDTO = z.infer<typeof loginIdSchema>;

// ===== RESPONSE DTOs =====
export interface LoginResponse {
  id: number;
  email: string;
  googleId?: string;
  hashedPassword?: string | null;
  createdAt: Date;
  updatedAt: Date;
}