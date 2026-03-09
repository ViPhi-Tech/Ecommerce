import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateUserInput {
  fullName: string;
  isActive?: boolean;
  email: string;
  googleId?: string;
  password?: string;
  roles: string[];
}

export interface UpdateUserInput {
  fullName?: string;
  isActive?: boolean;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createUserSchema = z.object({
  fullName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  isActive: z.boolean().optional().default(true),
  email: z.string().email({ message: "Email inválido" }),
  googleId: z.string().optional(),
  roles: z.array(z.string().uuid({ message: "Cada role deve ser um UUID válido" }))
           .min(1, { message: "É necessário ao menos 1 role" })
});

export const updateUserSchema = z.object({
  fullName: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }).optional(),
  isActive: z.boolean().optional()
});

export const userIdSchema = z.object({
  id: z.number().min(1, { message: "ID deve ser maior que 0" })
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createUserJsonSchema = zodToJsonSchema(createUserSchema);
export const updateUserJsonSchema = zodToJsonSchema(updateUserSchema);
export const userIdJsonSchema = zodToJsonSchema(userIdSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserIdDTO = z.infer<typeof userIdSchema>;

// ===== RESPONSE DTOs =====
export interface UserResponse {
  id: number;
  fullName: string | null;
  isActive: boolean;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}