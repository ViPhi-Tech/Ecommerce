import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { supplierController } from "../../config/dependencies/supplierDependencies"
import { authenticate } from "../middlewares/authMiddleware";
import { sanitizeSupplierBody } from "../middlewares/sanitizeSupplierBody";
import { createSupplierJsonSchema, updateSupplierJsonSchema, supplierIdJsonSchema } from "../../../application/dto/supplier/SupplierDTOs";

export default async function supplierRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

    fastify.post('/create', {
        schema: {
            tags: ['supplier'],
            body: createSupplierJsonSchema
        },
        preValidation: [sanitizeSupplierBody, authenticate],
        handler: supplierController.create.bind(supplierController)
    });

    fastify.get('/:id', {
        schema: {
            tags: ['supplier'],
            params: supplierIdJsonSchema  
        },
        preValidation: [authenticate],
        handler: supplierController.findById.bind(supplierController)
    });

    fastify.get('/all', {
        schema: {
            tags: ['supplier']
        },
        preValidation: [authenticate],
        handler: supplierController.findAll.bind(supplierController)
    });

    fastify.put('/update/:id', {
        schema: {
            tags: ['supplier'],
            body: updateSupplierJsonSchema,
            params: supplierIdJsonSchema
        },
        preValidation: [sanitizeSupplierBody, authenticate],
        handler: supplierController.update.bind(supplierController)
    });

    fastify.delete('/:id', 
        {
            schema: {
                tags: ['supplier'],
                params: supplierIdJsonSchema
            },
            preValidation: [authenticate],
            handler: supplierController.delete.bind(supplierController)
        }
    )
}