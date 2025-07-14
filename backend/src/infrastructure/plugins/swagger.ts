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
            // Define o host para o Swagger UI usar ao fazer requisições.
            // 'localhost' é o que o navegador verá via Nginx na porta 80.
            host: 'ecom-back-pk5h.onrender.com', 
            schemes: ['http', 'https'], // Suporta HTTP e HTTPS
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    });

    await fastify.register(swaggerUi, {
        routePrefix: '/api/docs', // O caminho que você acessa no navegador para a documentação
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false,
            filter: true,
        },
        staticCSP: true,
        transformSpecificationClone: true,
    });
});