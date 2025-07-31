import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { supplierController } from "../../config/dependencies/supplierDependencies"
import { authenticate } from "../middlewares/authMiddleware";
import { supplierCreateToSchema, supplierUpdateToSchema, supplierIdToSchema } from "../dto/Supplier.dto";

export default async function supplierRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

    fastify.post('/create', {
        schema: {
            tags: ['supplier'],
            body: supplierCreateToSchema
        },
        preValidation: [authenticate],
        handler: supplierController.create.bind(supplierController)
    });

    fastify.get('/:id', {
        schema: {
            tags: ['supplier'],
            params: supplierIdToSchema  
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
            body: supplierUpdateToSchema,
            params: supplierIdToSchema
        },
        preValidation: [authenticate],
        handler: supplierController.update.bind(supplierController)
    });

    fastify.delete('/:id', 
        {
            schema: {
                tags: ['supplier'],
                params: supplierIdToSchema
            },
            preValidation: [authenticate],
            handler: supplierController.delete.bind(supplierController)
        }
    )
}