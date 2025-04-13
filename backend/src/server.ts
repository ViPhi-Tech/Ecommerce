import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import handleRoutes from "./infrastructure/http/routes/HandleRoutes";
import cache from './infrastructure/plugins/cache';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const server = fastify({ logger: true });

server.register(cors, {
  origin: ['http://localhost:3000'],
  credentials: true
});
server.register(cookie)
// server.register(jwt);
// server.register(cache);

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