import { redis } from "../../database/redisClient";
import { RedisCacheService } from "../../services/RedisCacheService";


export const cacheService = new RedisCacheService(redis);

// Injetar em casos de uso que precisam de cache
//export const productUseCase = new ProductUseCase(
//  productRepository,
//  cacheService
//);

//export const bannerUseCase = new BannerUseCase(
//  bannerRepository,
//  cacheService
//);

