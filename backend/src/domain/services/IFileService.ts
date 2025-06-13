import { MultipartFile } from '@fastify/multipart';

export interface IFileService {
  uploadFile(file: MultipartFile): Promise<string>;
  destroyFile(files: string): Promise<string>;
}