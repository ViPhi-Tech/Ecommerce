import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { orderController } from "../../config/dependencies/orderDependencies";
import { authenticate } from "../middlewares/authMiddleware";
import { orderIdJsonSchema, createOrderJsonSchema, updateOrderJsonSchema, createPreOrderJsonSchema, getOrdersJsonSchema, getOrdersByClientJsonSchema } from '../../../application/dto/order/OrderDTOs';

export default async function saleRoutes(
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {

    fastify.post('/create', {
        schema: {
            tags: ['order'],
            body: createOrderJsonSchema
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

     fastify.post('/create/preOrder', {
        schema: {
            tags: ['order'],
            body: createPreOrderJsonSchema
        },
        preValidation: [authenticate],
        handler: orderController.createPreOrder.bind(orderController)
     })

     fastify.patch('/update', {
         schema: {
            tags: ['order'],
            body: updateOrderJsonSchema
         },
         preValidation: [authenticate],
         handler: orderController.updateOrder.bind(orderController)
     })


     fastify.get('/getOrders', {
        schema: {
            tags: ['order'],
            querystring: getOrdersJsonSchema
        },
        preValidation: [authenticate],
        handler: orderController.getOrdersByClient.bind(orderController)
     })

     fastify.delete('/:id', {
        schema: {
            tags: ['order'],
            params: orderIdJsonSchema
        },
        preValidation: [authenticate],
        handler: orderController.delete.bind(orderController)
     });


     fastify.get('/getOrdersByClient', {
        schema: {
            tags: ['order'],
            querystring: getOrdersByClientJsonSchema
        },
        preValidation: [authenticate],
        handler: orderController.getOrdersByClient.bind(orderController)
     })

}
