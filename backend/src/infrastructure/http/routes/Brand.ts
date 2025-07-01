import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { brandController } from "../../config/dependencies/brandDependencies"
import { authenticate } from "../middlewares/authMiddleware";
import { brandCreateToSchema, brandUpdateToSchema, brandIdToSchema } from "../dto/Brand.dto";
import { number } from 'zod';

export default async function brandRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

    fastify.post('/create', {
        schema: {
            tags: ['brand'],
            body: brandCreateToSchema
        },
        preValidation: [authenticate],
        handler: brandController.create.bind(brandController)
    });

    fastify.get('/:id', {
        schema: {
            tags: ['brand'],
            params: brandUpdateToSchema  
        },
        preValidation: [authenticate],
        handler: brandController.findById.bind(brandController)
    });

    fastify.get('/all', {
        schema: {
            tags: ['brand']
        },
        preValidation: [authenticate],
        handler: brandController.findAll.bind(brandController)
    });

    fastify.put('/update/:id', {
        schema: {
            tags: ['brand'],
            body: brandUpdateToSchema,
            params: brandIdToSchema
        },
        preValidation: [authenticate],
        handler: brandController.update.bind(brandController)
    });

    fastify.delete('/:id', 
        {
            schema: {
                tags: ['brand'],
                params: brandIdToSchema
            },
            preValidation: [authenticate],
            handler: brandController.delete.bind(brandController)
        }
    )
}