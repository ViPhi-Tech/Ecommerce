import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { productController } from "../../config/dependencies/productDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import {productCreateJsonSchema, productUpdateStockJsonSchema, productUpdateJsonSchema} from "../dto/Product.dto";
import { productIdJsonSchema } from "../dto/Product.dto";

export default async function productRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

    fastify.post('/create', {
        schema: {
            tags: ['product'],
            body: productCreateJsonSchema
        },
        preValidation: [authenticate],
        handler: productController.create.bind(productController)
    });

    fastify.get('/:id', {
        schema: {
            tags: ['product'],
            params: productIdJsonSchema
        },
        preValidation: [authenticate],
        handler: productController.findById.bind(productController)
    });

    fastify.get('/all', {
        schema: {
            tags: ['product']
        },
        preValidation: [authenticate],
        handler: productController.findAll.bind(productController)
    });
    
    fastify.post('/update/stock', {
        schema: {
            tags: ['product'],
            body: productUpdateStockJsonSchema
        },
        preValidation: [authenticate],
        handler: productController.updateStock.bind(productController)
    });

    fastify.put('/update', {
        schema: {
            tags: ['product'],
            body: productUpdateJsonSchema
        },
        preValidation: [authenticate],
        handler: productController.update.bind(productController)
    });

    fastify.delete('/:id', 
        {
            schema: {
                tags: ['product'],
                params: productIdJsonSchema
            },
            preValidation: [authenticate],
            handler: productController.delete.bind(productController)
        }
    )
}