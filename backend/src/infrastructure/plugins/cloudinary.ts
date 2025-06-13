import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { v2 as cloudinary } from 'cloudinary';

export default fp(async (fastify: FastifyInstance) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  });

  fastify.decorate('cloudinary', cloudinary);
});

declare module 'fastify' {
  interface FastifyInstance {
    cloudinary: typeof cloudinary;
  }
}
