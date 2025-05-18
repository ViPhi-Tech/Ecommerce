import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import handleRoutes from './infrastructure/http/routes/handleRoutes';
import swagger from './infrastructure/plugins/swagger';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const server = fastify({ logger: false });

server.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
});
server.register(swagger);
server.register(cookie)
// server.register(jwt);
// server.register(cache);

server.register(handleRoutes);

// Iniciar o servidor
const start = async () => {
  try {
    await server.listen({ port: 8000, host: 'localhost' });
    console.log('Servidor rodando em http://localhost:8000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();