import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { productController } from "../../config/dependencies/productDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import {productCreateJsonSchema, productUpdateStockJsonSchema, productUpdateJsonSchema, findMovimentJsonSchema, updateManyStocksJsonSchema} from "../dto/Product.dto";
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
    );


    fastify.get('/getMovimentByProduct/:productIds', {
    schema: {
        tags: ['product'],
        params: {
            type: 'object',
            properties: {
                productIds: { type: 'string' } // recebe "1,2,3,4"
            },
            required: ['productIds']
        },
    },
    preValidation: [authenticate],
    handler: productController.getMovimentByProduct.bind(productController)
    })



    fastify.get('/findByName/:param', {
        schema: {
            tags: ['product'],
            params: {
                type: 'object',
                properties: {
                    param: { type: 'string' }
                },
                required: ['param']
            }
        },
        preValidation: [authenticate],
        handler: productController.findProductByName.bind(productController)
    });

    fastify.get('/search/:param', {
        schema: {
            tags: ['product'],
            params: {
                type: 'object',
                properties: {
                    param: { type: 'string' }
                },
                required: ['param']
            }
        },
        preValidation: [authenticate],
        handler: productController.findByParam.bind(productController)
    });


    fastify.get('/moviment/metrics',{
        schema: {
            tags: ['product']
            },
        preValidation: [authenticate],
        handler: productController.getMetrics.bind(productController)
    }
    );
        fastify.get('/getMovimentByDate',{
        schema: {
            tags: ['product'],
            querystring: findMovimentJsonSchema,
                required: ['date', 'type']
            },
        preValidation: [authenticate],
        handler: productController.findMovimentByDate.bind(productController)
    }
    );


    fastify.post('/movimentManyStocks', {
        schema: {
            tags: ['product'],
            body: updateManyStocksJsonSchema
        },
        preValidation: [authenticate],
        handler: productController.updateManyStocks.bind(productController)
    })
}
