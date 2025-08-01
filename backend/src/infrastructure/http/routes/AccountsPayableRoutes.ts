import { FastifyInstance } from 'fastify';
import { accountsPayableController } from '../../config/dependencies/accountsPayableDependencies';
import { authenticate } from "../middlewares/authMiddleware";
import {
  accountsPayableIdJsonSchema,
  accountsPayableCreateJsonSchema,
  accountsPayableUpdateJsonSchema,
  accountsPayableSupplierJsonSchema,
  accountsPayableStatusJsonSchema,
} from '../dto/AccountsPayable.dto';

export async function accountsPayableRoutes(fastify: FastifyInstance) {
  // Criar conta a pagar
  fastify.post('/create', {
    preHandler: [authenticate],
    schema: {
      tags: ['Accounts Payable'],
      summary: 'Criar nova conta a pagar',
      body: accountsPayableCreateJsonSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
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
      },
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
      params: accountsPayableIdJsonSchema,
      body: accountsPayableUpdateJsonSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
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
      },
    },
    handler: accountsPayableController.delete.bind(accountsPayableController),
  });
}