import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { accountsReceivableController } from "../../config/dependencies/accountsReceivableDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import {
  accountsReceivableIdSchema,
  createAccountsReceivableJsonSchema,
  updateAccountsReceivableSchema,
  accountsReceivableClientSchema,
  accountsReceivableStatusSchema,
} from "../../../application/dto/accountsReceivable/AccountsReceivableDTOs";
import { zodToJsonSchema } from "zod-to-json-schema";

export default async function accountsReceivableRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  // Criar conta a receber
  fastify.post("/create", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Criar nova conta a receber",
      body: createAccountsReceivableJsonSchema,
    },
    handler: accountsReceivableController.create.bind(accountsReceivableController),
  });

  fastify.get("/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Buscar conta a receber por ID",
      params: zodToJsonSchema(accountsReceivableIdSchema),
    },
    handler: accountsReceivableController.findById.bind(accountsReceivableController),
  });

  fastify.get("/client/:clientId", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Buscar contas a receber por cliente",
      params: zodToJsonSchema(accountsReceivableClientSchema),
    },
    handler: accountsReceivableController.findByClient.bind(accountsReceivableController),
  });

  fastify.get("/status/:status", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Buscar contas a receber por status",
      params: zodToJsonSchema(accountsReceivableStatusSchema),
    },
    handler: accountsReceivableController.findByStatus.bind(accountsReceivableController),
  });

  fastify.put("/update/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Atualizar conta a receber",
      params: zodToJsonSchema(accountsReceivableIdSchema),
      body: zodToJsonSchema(updateAccountsReceivableSchema),
    },
    handler: accountsReceivableController.update.bind(accountsReceivableController),
  });

  fastify.patch("/update-status/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Atualizar status da conta a receber",
      params: zodToJsonSchema(accountsReceivableIdSchema),
      body: zodToJsonSchema(updateAccountsReceivableSchema),
    },
    handler: accountsReceivableController.updateStatus.bind(accountsReceivableController),
  });

  fastify.delete("/:id", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Deletar conta a receber",
      params: zodToJsonSchema(accountsReceivableIdSchema),
    },
    handler: accountsReceivableController.delete.bind(accountsReceivableController),
  });


  fastify.get("/getAll", {
    preValidation: [authenticate],
    schema: {
      tags: ["accounts-receivable"],
      summary: "Busca todas as contas a receber",
    },
    handler: accountsReceivableController.findAll.bind(accountsReceivableController)
  });
}
