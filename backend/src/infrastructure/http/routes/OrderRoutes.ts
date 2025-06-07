import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { orderController } from "../../config/dependencies/orderDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import { orderIdJsonSchema, orderCreateJsonSchema, orderUpdateJsonSchema } from '../dto/Order.dto';

export default async function saleRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

    fastify.post('/create', {
        schema: {
            tags: ['order'],
            body: orderCreateJsonSchema
        },
        preValidation: [authenticate],
        handler: orderController.create.bind(orderController)
    });

     fastify.get('/:id', {
         schema: {
             tags: ['order'],
             params: orderIdJsonSchema
         },
         preValidation: [authenticate],
         handler: orderController.findById.bind(orderController)
     });

     fastify.get('/all', {
         schema: {
             tags: ['order']
         },
         preValidation: [authenticate],
         handler: orderController.findAll.bind(orderController)
     });

}
