import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const CreatePartnerDTO = z.object({
  name: z.string(),
  email: z.string().email(),
  document: z.string(),
  phone: z.string(),
});

export type CreatePartnerDTO = z.infer<typeof CreatePartnerDTO>;

export const UpdatePartnerDTO = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  document: z.string().optional(),
  phone: z.string().optional(),
});

export type UpdatePartnerDTO = z.infer<typeof UpdatePartnerDTO>;

export const partnerSchemaDTO = z.object({
  ...CreatePartnerDTO.shape,
});


export const partnerJsonSchema = zodToJsonSchema(CreatePartnerDTO);


export type PartnerDto = z.infer<typeof partnerSchemaDTO>;