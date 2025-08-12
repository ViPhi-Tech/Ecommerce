import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { accountsPayableController } from "../../config/dependencies/accountsPayableDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import {
  accountsPayableIdJsonSchema,
  createAccountsPayableJsonSchema,
  updateAccountsPayableJsonSchema,
  accountsPayableSupplierJsonSchema,
  accountsPayableStatusJsonSchema,
} from "../../../application/dto/accountsPayable/AccountsPayableDTOs";

export default async function accountsPayableRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Criar conta a pagar
  fastify.post("/create", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Criar nova conta a pagar",
      body: createAccountsPayableJsonSchema,
    },
    handler: accountsPayableController.create.bind(accountsPayableController),
  });

  // Buscar conta a pagar por ID
  fastify.get("/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Buscar conta a pagar por ID",
      params: accountsPayableIdJsonSchema,
    },
    handler: accountsPayableController.findById.bind(accountsPayableController),
  });

  // Listar todas as contas a pagar
  fastify.get("/all", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Listar todas as contas a pagar",
    },
    handler: accountsPayableController.findAll.bind(accountsPayableController),
  });

  // Buscar contas a pagar por fornecedor
  fastify.get("/supplier/:supplierId", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Buscar contas a pagar por fornecedor",
      params: accountsPayableSupplierJsonSchema,
    },
    handler: accountsPayableController.findBySupplier.bind(
      accountsPayableController
    ),
  });

  // Buscar contas a pagar por status
  fastify.get("/status/:status", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Buscar contas a pagar por status",
      params: accountsPayableStatusJsonSchema,
    },
    handler: accountsPayableController.findByStatus.bind(
      accountsPayableController
    ),
  });

  // Buscar contas a pagar em atraso
  fastify.get("/overdue", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Buscar contas a pagar em atraso",
    },
    handler: accountsPayableController.findOverdue.bind(
      accountsPayableController
    ),
  });

  // Atualizar conta a pagar
  fastify.put("/update/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Atualizar conta a pagar",
      params: accountsPayableIdJsonSchema,
      body: updateAccountsPayableJsonSchema,
    },
    handler: accountsPayableController.update.bind(accountsPayableController),
  });

  // Atualizar status da conta a pagar
  fastify.patch("/update-status/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Atualizar status da conta a pagar",
      params: accountsPayableIdJsonSchema,
      body: updateAccountsPayableJsonSchema,
    },
    handler: accountsPayableController.updateStatus.bind(accountsPayableController),
  });

  // Deletar conta a pagar
  fastify.delete("/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Deletar conta a pagar",
      params: accountsPayableIdJsonSchema,
    },
    handler: accountsPayableController.delete.bind(accountsPayableController),
  });
}
