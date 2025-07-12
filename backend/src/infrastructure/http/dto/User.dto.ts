import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';


export type CreateUserDTO = {
    fullName: string;
    isActive?: boolean;
    email: string;
    googleId?: string;
    password?: string;
  };
  
  export type UpdateUserDTO = Partial<{
    fullName: string;
    isActive: boolean;
  }>;

export const userJsonSchema = z.object({
    name: z.string(),
    isActive: z.boolean().optional(),
});


export const userToSchema = zodToJsonSchema(userJsonSchema);

export type UserDTO = z.infer<typeof userJsonSchema>;
