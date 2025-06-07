import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { productSchemaDTO } from './Product.dto';

export const orderItemSchemaDTO = z.object({
  productId: z.number().min(1, { message: "ProductId is required" }),
  quantity: z.number().min(1, { message: "Quantity must be greater than zero" }),
  price: z.number().min(0, { message: "Price must be greater than or equal to zero" }),
});

export const orderCreateSchemaDTO = z.object({
  clientId: z.number().min(1, { message: "Client ID is required" }),
  total: z.number().min(0, { message: "Total must be greater than or equal to zero" }),
  items: z.array(orderItemSchemaDTO).min(1, { message: "At least one item is required" })
});

export const orderSchemaDTO = z.object({
  clientId: z.number().optional(),
  total: z.number().min(0, { message: "Total must be greater than or equal to zero" }),
  items: z.array(orderItemSchemaDTO).min(1, { message: "At least one item is required" })

});

export const orderIDSchema = z.object({
  id: z.number().min(1, { message: "Sale ID is required" })
});

export const orderUpdateSchema = z.object({
  id: z.number().min(1, { message: "Sale ID is required" }),
  clientId: z.number().optional(),
  total: z.number().min(0, { message: "Total must be greater than or equal to zero" }),
  items: z.array(orderItemSchemaDTO).min(1, { message: "At least one item is required" })
});

// JSON Schema conversions
export const orderJsonSchema = zodToJsonSchema(orderSchemaDTO);
export const orderIdJsonSchema = zodToJsonSchema(orderIDSchema);
export const orderUpdateJsonSchema = zodToJsonSchema(orderUpdateSchema);
export const orderItemJsonSchema = zodToJsonSchema(orderItemSchemaDTO);
export const orderCreateJsonSchema = zodToJsonSchema(orderCreateSchemaDTO);
// Type exports
export type OrderDTO = z.infer<typeof orderSchemaDTO>;
export type OrderID = z.infer<typeof orderIDSchema>;
export type OrderItemDTO = z.infer<typeof orderItemSchemaDTO>;
export type OrderUpdateDTO = z.infer<typeof orderUpdateSchema>;
export type OrderCreateDTO = z.infer<typeof orderCreateSchemaDTO>;
