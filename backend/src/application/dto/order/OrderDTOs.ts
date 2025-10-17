import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateOrderInput {
  clientId: number;
  total: number;
  items: OrderItemInput[];
  payments: PaymentLabelInput[];
}

export interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

export interface PaymentLabelInput {
  value: number;
  typeId: string;
}

export interface UpdateOrderInput {
  clientId?: number;
  total: number;
  items: OrderItemInput[];
}

export interface CreatePreOrderInput {
  clientId: number;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const orderItemSchema = z.object({
  productId: z.number().min(1, { message: "ID do produto é obrigatório" }),
  quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" }),
  price: z.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
});

export const paymentLabelSchema = z.object({
  value: z.number().min(0, { message: "Valor deve ser maior que zero" }),
  typeId: z.string().min(1, { message: "Tipo de pagamento é obrigatório" })
});

export const createOrderSchema = z.object({
  clientId: z.number().optional(),
  total: z.number().min(0, { message: "Total deve ser maior ou igual a zero" }),
  items: z.array(orderItemSchema).min(1, { message: "Pelo menos um item é obrigatório" }),
  payments: z.array(paymentLabelSchema).min(1, { message: "Pelo menos um pagamento é obrigatório" })
});

export const updateOrderSchema = z.object({
  clientId: z.number().optional(),
  total: z.number().min(0, { message: "Total deve ser maior ou igual a zero" }),
  items: z.array(orderItemSchema).min(1, { message: "Pelo menos um item é obrigatório" })
});

export const orderIdSchema = z.object({
  id: z.number().min(1, { message: "ID do pedido é obrigatório" })
});

export const createPreOrderSchema = z.object({
  clientId: z.number().min(1, { message: "ID do cliente é obrigatório" }),
});


export const getOrders = z.object({
  clientId: z.number().min(1, { message: "ID do cliente é obrigatório" }).optional(),
  startDate: z.string().min(1, { message: "Data inicial é obrigatória" }),
  endDate: z.string().min(1, { message: "Data final é obrigatória" }),
  paymentTypeId: z.string().min(1, { message: "Tipo de pagamento é obrigatório" }).optional(),
});


export const getOrdersByClient = z.object({
  clientId: z.string().min(1, { message: "ID do cliente é obrigatório" }),
  startDate: z.string().min(1, { message: "Data inicial é obrigatória" }),
  endDate: z.string().min(1, { message: "Data final é obrigatória" }),
  paymentTypeId: z.string().min(1, { message: "Tipo de pagamento é obrigatório" }).optional(),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createOrderJsonSchema = zodToJsonSchema(createOrderSchema);
export const updateOrderJsonSchema = zodToJsonSchema(updateOrderSchema);
export const orderIdJsonSchema = zodToJsonSchema(orderIdSchema);
export const orderItemJsonSchema = zodToJsonSchema(orderItemSchema);
export const paymentLabelJsonSchema = zodToJsonSchema(paymentLabelSchema);
export const createPreOrderJsonSchema = zodToJsonSchema(createPreOrderSchema);
export const getOrdersJsonSchema = zodToJsonSchema(getOrders);
export const getOrdersByClientJsonSchema = zodToJsonSchema(getOrdersByClient);

// ===== TYPES (Para TypeScript) =====
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>;
export type OrderIdDTO = z.infer<typeof orderIdSchema>;
export type OrderItemDTO = z.infer<typeof orderItemSchema>;
export type PaymentLabelDTO = z.infer<typeof paymentLabelSchema>;
export type CreatePreOrderDTO = z.infer<typeof createPreOrderSchema>;
export type GetOrdersDTO = z.infer<typeof getOrders>;
export type GetOrdersByClientDTO = z.infer<typeof getOrdersByClient>;

// ===== RESPONSE DTOs =====
export interface OrderResponse {
  id: number;
  clientId: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemResponse[];
  client?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface OrderItemResponse {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
}