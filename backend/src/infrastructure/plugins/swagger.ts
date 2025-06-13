// src/plugins/swagger.ts
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export default fp(async (fastify: FastifyInstance) => {
    await fastify.register(swagger, {
        swagger: {
            info: {
                title: 'API backend com Fastify',
                description: 'Documentação da API com Swagger',
                version: '1.0.0',
            },
            host: 'localhost:8000',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    });

    await fastify.register(swaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false,
            filter: true,
        },
        staticCSP: true,
        transformSpecificationClone: true,
    });
});
