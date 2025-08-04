import { FastifyInstance } from 'fastify';
import { accountsPayableController } from '../../config/dependencies/accountsPayableDependencies';
import { authenticate } from "../middlewares/authMiddleware";
import {
  createAccountsPayableJsonSchema,
  updateAccountsPayableJsonSchema,
  accountsPayableIdJsonSchema,
  accountsPayableSupplierJsonSchema,
  accountsPayableStatusJsonSchema,
  createAccountsPayableSchema,
  updateAccountsPayableSchema,
  accountsPayableIdSchema,
  accountsPayableSupplierSchema,
  accountsPayableStatusSchema
} from '../../../application/dto/accountsPayable/AccountsPayableDTOs';

export async function accountsPayableRoutes(fastify: FastifyInstance) {
  // Criar conta a pagar
  fastify.post('/create', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Criar nova conta a pagar',
      description: 'Cria uma nova conta a pagar. Todas as datas devem ser enviadas no formato YYYY-MM-DD (ex: 2023-12-31)',
      body: {
        type: 'object',
        properties: {
          originalDueDate: { type: 'string', description: 'Data de vencimento original no formato YYYY-MM-DD', example: '2023-12-31' },
          issueDate: { type: 'string', description: 'Data de emissão no formato YYYY-MM-DD', example: '2023-12-01' },
          dueDate: { type: 'string', description: 'Data de vencimento no formato YYYY-MM-DD', example: '2023-12-31' },
          competenceDate: { type: 'string', description: 'Data de competência no formato YYYY-MM-DD', example: '2023-12-01' },
          amount: { type: 'number', description: 'Valor da conta', example: 1500.50 },
          recurringPurchase: { type: 'boolean', description: 'Se é uma compra recorrente', example: false },
          description: { type: 'string', description: 'Descrição da conta', example: 'Pagamento de fornecedor' },
          supplierId: { type: 'integer', description: 'ID do fornecedor', example: 1 },
          status: { type: 'string', enum: ['pending', 'paid', 'overdue', 'cancelled'], description: 'Status da conta', example: 'pending' }
        },
        required: ['originalDueDate', 'issueDate', 'dueDate', 'competenceDate', 'amount', 'description', 'supplierId']
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
    preValidation: async (request, reply) => {
      try {
        createAccountsPayableSchema.parse(request.body);
      } catch (error: any) {
        reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors || error.message,
        });
      }
    },
    handler: accountsPayableController.create.bind(accountsPayableController),
  });

  // Buscar conta a pagar por ID
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Buscar conta a pagar por ID',
      params: accountsPayableIdJsonSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
    preValidation: async (request, reply) => {
      try {
        const params = request.params as { id: string };
        const parsedParams = { id: Number(params.id) };
        accountsPayableIdSchema.parse(parsedParams);
      } catch (error: any) {
        reply.status(400).send({
          success: false,
          message: 'ID inválido',
          errors: error.errors || error.message,
        });
      }
    },
    handler: accountsPayableController.findById.bind(accountsPayableController),
  });

  // Listar todas as contas a pagar
  fastify.get('/all', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Listar todas as contas a pagar',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
    handler: accountsPayableController.findAll.bind(accountsPayableController),
  });

  // Buscar contas a pagar por fornecedor
  fastify.get('/supplier/:supplierId', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Buscar contas a pagar por fornecedor',
      params: accountsPayableSupplierJsonSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
    preValidation: async (request, reply) => {
      try {
        const params = request.params as { supplierId: string };
        const parsedParams = { supplierId: Number(params.supplierId) };
        accountsPayableSupplierSchema.parse(parsedParams);
      } catch (error: any) {
        reply.status(400).send({
          success: false,
          message: 'ID do fornecedor inválido',
          errors: error.errors || error.message,
        });
      }
    },
    handler: accountsPayableController.findBySupplier.bind(accountsPayableController),
  });

  // Buscar contas a pagar por status
  fastify.get('/status/:status', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Buscar contas a pagar por status',
      params: accountsPayableStatusJsonSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
    preValidation: async (request, reply) => {
      try {
        accountsPayableStatusSchema.parse(request.params);
      } catch (error: any) {
        reply.status(400).send({
          success: false,
          message: 'Status inválido',
          errors: error.errors || error.message,
        });
      }
    },
    handler: accountsPayableController.findByStatus.bind(accountsPayableController),
  });

  // Buscar contas a pagar em atraso
  fastify.get('/overdue', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Buscar contas a pagar em atraso',
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
    handler: accountsPayableController.findOverdue.bind(accountsPayableController),
  });

  // Atualizar conta a pagar
  fastify.put('/update/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Atualizar conta a pagar',
      description: 'Atualiza uma conta a pagar existente. Todas as datas devem ser enviadas no formato YYYY-MM-DD (ex: 2023-12-31)',
      params: accountsPayableIdJsonSchema,
      body: {
        type: 'object',
        properties: {
          originalDueDate: { type: 'string', description: 'Data de vencimento original no formato YYYY-MM-DD', example: '2023-12-31' },
          issueDate: { type: 'string', description: 'Data de emissão no formato YYYY-MM-DD', example: '2023-12-01' },
          dueDate: { type: 'string', description: 'Data de vencimento no formato YYYY-MM-DD', example: '2023-12-31' },
          competenceDate: { type: 'string', description: 'Data de competência no formato YYYY-MM-DD', example: '2023-12-01' },
          amount: { type: 'number', description: 'Valor da conta', example: 1500.50 },
          recurringPurchase: { type: 'boolean', description: 'Se é uma compra recorrente', example: false },
          description: { type: 'string', description: 'Descrição da conta', example: 'Pagamento de fornecedor atualizado' },
          supplierId: { type: 'integer', description: 'ID do fornecedor', example: 1 },
          status: { type: 'string', enum: ['pending', 'paid', 'overdue', 'cancelled'], description: 'Status da conta', example: 'paid' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
    preValidation: async (request, reply) => {
      try {
        const params = request.params as { id: string };
        const parsedParams = { id: Number(params.id) };
        accountsPayableIdSchema.parse(parsedParams);
        updateAccountsPayableSchema.parse(request.body);
      } catch (error: any) {
        reply.status(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors || error.message,
        });
      }
    },
    handler: accountsPayableController.update.bind(accountsPayableController),
  });

  // Deletar conta a pagar
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Deletar conta a pagar',
      params: accountsPayableIdJsonSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    },
    preValidation: async (request, reply) => {
      try {
        const params = request.params as { id: string };
        const parsedParams = { id: Number(params.id) };
        accountsPayableIdSchema.parse(parsedParams);
      } catch (error: any) {
        reply.status(400).send({
          success: false,
          message: 'ID inválido',
          errors: error.errors || error.message,
        });
      }
    },
    handler: accountsPayableController.delete.bind(accountsPayableController),
  });
}