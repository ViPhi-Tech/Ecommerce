import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { accountsPayableController } from "../../config/dependencies/accountsPayableDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import {
  accountsPayableIdJsonSchema,
  createAccountsPayableJsonSchema,
  updateAccountsPayableJsonSchema,
  accountsPayableSupplierJsonSchema,
  accountsPayableStatusJsonSchema,
  accountsPayableListQueryJsonSchema,
} from "../../../application/dto/accountsPayable/AccountsPayableDTOs";

export default async function accountsPayableRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post("/create", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Criar nova conta a pagar",
      body: createAccountsPayableJsonSchema,
    },
    handler: accountsPayableController.create.bind(accountsPayableController),
  });

  // Rotas literais antes de /:id para não capturar "all", "overdue", etc.
  fastify.get("/all", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary:
        "Listar contas a pagar (query opcional: dueDateFrom, dueDateTo YYYY-MM-DD; status all|pending|paid|overdue|due_soon|cancelled)",
      querystring: accountsPayableListQueryJsonSchema,
    },
    handler: accountsPayableController.findAll.bind(accountsPayableController),
  });

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

  fastify.get("/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-payable"],
      summary: "Buscar conta a pagar por ID",
      params: accountsPayableIdJsonSchema,
    },
    handler: accountsPayableController.findById.bind(accountsPayableController),
  });

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
