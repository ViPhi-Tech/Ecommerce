import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export default fp(async (fastify: FastifyInstance) => {
    await fastify.register(swagger, {
        openapi: {
            openapi: '3.0.0',
            info: {
                title: 'API backend com Fastify',
                description: 'Documentação da API',
                version: '1.0.0',
            },
            servers: [
                { url: 'http://api.86.48.22.217.sslip.io' }
            ],
        },
    });

    await fastify.register(swaggerUi, {
        routePrefix: '/api/docs',
        uiConfig: {
            docExpansion: 'none',
            deepLinking: true,
            filter: true,
        },
        staticCSP: true,
        transformSpecificationClone: true,
    });
});