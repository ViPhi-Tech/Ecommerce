import fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import handleRoutes from './infrastructure/http/routes/handleRoutes';
import swagger from './infrastructure/plugins/swagger';
import dotenv from 'dotenv';
import path from 'path';

import cloudinary from './infrastructure/plugins/cloudinary';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const server = fastify({ logger: true });

server.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:4200', 'http://127.0.0.1:4200', 'http://127.0.0.1'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
});
server.register(swagger);
server.register(cookie)
server.register(cloudinary)
// server.register(jwt);
// server.register(cache);

server.register(handleRoutes);

// Iniciar o servidor
const start = async () => {
  try {
    await server.listen({ port: 8000, host: '0.0.0.0' });
    console.log('Servidor rodando em http://localhost:8000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();