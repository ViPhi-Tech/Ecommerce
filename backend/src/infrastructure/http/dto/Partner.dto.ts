import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const partnerCreateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  document: z.string().min(1, { message: "Document is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
});

export const partnerUpdateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  document: z.string().min(1, { message: "Document must be at least 1 character" }).optional(),
  phone: z.string().min(1, { message: "Phone must be at least 1 character" }).optional(),
});

export const partnerIdSchema = z.object({
  id: z.number().min(1, { message: "ID must be greater than 0" }),
});

export const partnerCreateJsonSchema = zodToJsonSchema(partnerCreateSchema);
export const partnerUpdateJsonSchema = zodToJsonSchema(partnerUpdateSchema);
export const partnerIdJsonSchema = zodToJsonSchema(partnerIdSchema);

export type PartnerCreateDTO = z.infer<typeof partnerCreateSchema>;
export type PartnerUpdateDTO = z.infer<typeof partnerUpdateSchema>;
export type PartnerIdDTO = z.infer<typeof partnerIdSchema>;