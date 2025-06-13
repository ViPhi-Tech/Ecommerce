import { FastifyRequest, FastifyReply } from 'fastify';
import { UploadFileUseCase } from '../../../application/use-cases/file/UploadFileUseCase';
import { DestroyFileUseCase } from '../../../application/use-cases/file/DestroyFileUseCase';
import { HTTP_STATUS } from '../../../shared/types/httpStatus';
import { HTTP_MESSAGES } from '../../../shared/types/httpMessages';
import { ApiResponse } from '../../../shared/types/apiResponse';
import { UploadFileDTO, DestroyFileDTO } from '../dto/File.dto';

export class FileController {
  constructor(
    private uploadFileUseCase: UploadFileUseCase,
    private destroyFileUseCase: DestroyFileUseCase
  ) {}

  async upload(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const fileData = request.body as UploadFileDTO;
  
      const uploaded = await this.uploadFileUseCase.execute({
        folder: fileData.folder,
        file: fileData.file as Required<UploadFileDTO>['file']
      });
  
      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
        dados: uploaded,
      });
  
    } catch (error: any) {
      console.error('Erro no upload:', error.message);
  
      const mensagemErro = error?.message || 'Erro interno ao fazer upload do arquivo';
      const errosEsperados = [
        'Arquivo não fornecido',
        'Formato de base64 inválido',
        'Arquivo não encontrado',
        'Tipo de arquivo inválido'
      ];
  
      const isErroEsperado = errosEsperados.some(msg => mensagemErro.includes(msg));
  
      return reply
        .code(isErroEsperado ? HTTP_STATUS.API_STATUS_BAD_REQUEST : HTTP_STATUS.API_STATUS_INTERNAL_ERROR)
        .send({
          status: false,
          descricao: isErroEsperado ? mensagemErro : HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR,
        });
    }
  }

  async destroy(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const destroyData = request.body as DestroyFileDTO;
      const destroyed = await this.destroyFileUseCase.execute({ file: destroyData.publicId });

      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
        dados: destroyed,
      });
    } catch (error) {
      console.error(error);
      return reply
        .code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR)
        .send({
          status: false,
          descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR,
        });
    }
  }
}