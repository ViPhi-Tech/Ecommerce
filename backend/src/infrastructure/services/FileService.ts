import { IFileService } from '../../domain/services/IFileService';
import { MultipartFile } from '@fastify/multipart';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { v2 as cloudinary } from 'cloudinary';

const pump = promisify(pipeline);

export class FileService implements IFileService {
  constructor(private readonly cloudinaryInstance = cloudinary) {}

  async uploadFile(file: MultipartFile): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        { folder: 'meu_projeto' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
      pump(file.file, uploadStream).catch(reject);
    });
  }
  async destroyFile(file: string): Promise<string> {
    const publicId = `meu_projeto/${file.split('.')[0]}`;
    await this.cloudinaryInstance.uploader.destroy(publicId);
    return publicId;
  }
}