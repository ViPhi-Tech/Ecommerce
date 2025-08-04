import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { categoryController } from '../../config/dependencies/categoryDependencies';
import { CategoryController } from '../controllers/CategoryController';
import { authenticate } from "../middlewares/authMiddleware";
import { createCategoryJsonSchema, updateCategoryJsonSchema } from "../../../application/dto/category/CategoryDTOs";
import { categoryIdJsonSchema } from "../../../application/dto/category/CategoryDTOs";

export default async function categoryRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/create', {
        schema: {
            tags: ['category'],
            body: createCategoryJsonSchema
        },
        preValidation: [authenticate],
        handler: categoryController.create.bind(categoryController)
    });

    fastify.get('/:id', {
        schema: {
            tags: ['category'],
            params: categoryIdJsonSchema
        },
        preValidation: [authenticate],
        handler: categoryController.findById.bind(categoryController)
    });

    fastify.get('/all', {
        schema: {
            tags: ['category']
        },
        preValidation: [authenticate],
        handler: categoryController.findAll.bind(categoryController)
    });

    fastify.put('/update', {
        schema: {
            tags: ['category'],
            body: updateCategoryJsonSchema
        },
        preValidation: [authenticate],
        handler: categoryController.update.bind(categoryController)
    });

    fastify.delete('/:id', 
        {
            schema: {
                tags: ['category'],
                params: categoryIdJsonSchema
            },
            preValidation: [authenticate],
            handler: categoryController.delete.bind(categoryController)
        }
    )
}
