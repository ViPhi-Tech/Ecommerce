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

    // fastify.get('/:id', {
    //     schema: {
    //         tags: ['sale'],
    //         params: saleIdJsonSchema
    //     },
    //     preValidation: [authenticate],
    //     handler: saleController.findById.bind(saleController)
    // });

    // fastify.get('/all', {
    //     schema: {
    //         tags: ['sale']
    //     },
    //     preValidation: [authenticate],
    //     handler: saleController.findAll.bind(saleController)
    // });

    // fastify.put('/update', {
    //     schema: {
    //         tags: ['sale'],
    //         body: saleUpdateJsonSchema
    //     },
    //     preValidation: [authenticate],
    //     handler: saleController.update.bind(saleController)
    // });

    // fastify.delete('/:id', {
    //     schema: {
    //         tags: ['sale'],
    //         params: saleIdJsonSchema
    //     },
    //     preValidation: [authenticate],
    //     handler: saleController.delete.bind(saleController)
    // });
}
