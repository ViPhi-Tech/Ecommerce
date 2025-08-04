import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleLoginInput {
  credential: string;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export const googleLoginSchema = z.object({
  credential: z.string().min(1, { message: "Credential do Google é obrigatório" }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const loginJsonSchema = zodToJsonSchema(loginSchema);
export const googleLoginJsonSchema = zodToJsonSchema(googleLoginSchema);

// ===== TYPES (Para TypeScript) =====
export type LoginDTO = z.infer<typeof loginSchema>;
export type GoogleLoginDTO = z.infer<typeof googleLoginSchema>;

// ===== RESPONSE DTOs =====
export interface AuthResponse {
  status: boolean;
  descricao: string;
  token?: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}