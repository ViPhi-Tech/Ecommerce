import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { productController } from "../../config/dependencies/productDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import { productCreateJsonSchema } from "../../../shared/dtos/Product.dto";

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
    })
}