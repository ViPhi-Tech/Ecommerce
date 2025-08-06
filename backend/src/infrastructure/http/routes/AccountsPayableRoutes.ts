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
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Criar nova conta a pagar',
      description: 'Cria uma nova conta a pagar. Todas as datas devem ser enviadas no formato YYYY-MM-DD (ex: 2023-12-31)',
      body: createAccountsPayableJsonSchema,
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
    preValidation: [authenticate],
    handler: accountsPayableController.create.bind(accountsPayableController),
  });

  // Buscar conta a pagar por ID
  fastify.get('/:id', {
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
    preValidation: [authenticate],
    handler: accountsPayableController.findById.bind(accountsPayableController),
  });

  // Listar todas as contas a pagar
  fastify.get('/all', {
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
    preValidation: [authenticate],
    handler: accountsPayableController.findAll.bind(accountsPayableController),
  });

  // Buscar contas a pagar por fornecedor
  fastify.get('/supplier/:supplierId', {
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
    preValidation: [authenticate],
    handler: accountsPayableController.findBySupplier.bind(accountsPayableController),
  });

  // Buscar contas a pagar por status
  fastify.get('/status/:status', {
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
    preValidation: [authenticate],
    handler: accountsPayableController.findByStatus.bind(accountsPayableController),
  });

  // Buscar contas a pagar em atraso
  fastify.get('/overdue', {
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
    preValidation: [authenticate],
    handler: accountsPayableController.findOverdue.bind(accountsPayableController),
  });

  // Atualizar conta a pagar
  fastify.put('/update/:id', {
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Atualizar conta a pagar',
      description: 'Atualiza uma conta a pagar existente. Todas as datas devem ser enviadas no formato YYYY-MM-DD (ex: 2023-12-31)',
      params: accountsPayableIdJsonSchema,
      body: updateAccountsPayableJsonSchema,
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
    preValidation: [authenticate],
    handler: accountsPayableController.update.bind(accountsPayableController),
  });

  // Deletar conta a pagar
  fastify.delete('/:id', {
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
    preValidation: [authenticate],
    handler: accountsPayableController.delete.bind(accountsPayableController),
  });
}