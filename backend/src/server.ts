import fastify from 'fastify';
import cookie from '@fastify/cookie';
import handleRoutes from './infrastructure/http/routes/handleRoutes';

const server = fastify({ logger: true });

server.register(cookie)
server.register(handleRoutes);

// Iniciar o servidor
const start = async () => {
  try {
    await server.listen({ port: 8000 });
    console.log('Servidor rodando em http://localhost:8000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();