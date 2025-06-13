import { UploadFileInput } from "../../dto/file/UploadFile";
import { IFileService } from "../../../domain/services/IFileService";
import fs from 'fs';

export class UploadFileUseCase {
  constructor(private readonly uploadService: IFileService) {}

  async execute(fileData: UploadFileInput): Promise<string> {
    let fileToUpload;

    try {
      if (!fileData || !fileData.file) {
        throw new Error("Arquivo não fornecido no parâmetro 'file'.");
      }

      if (typeof fileData.file === 'string') {
        if (fileData.file.startsWith('data:')) {
          // Extração da base64 após a vírgula
          const base64Parts = fileData.file.split(',');
          if (base64Parts.length !== 2 || !base64Parts[1]) {
            throw new Error("Formato de base64 inválido no arquivo.");
          }
          fileToUpload = Buffer.from(base64Parts[1], 'base64');
        } else {
          // Verifica se o arquivo existe no caminho antes de criar stream
          if (!fs.existsSync(fileData.file)) {
            throw new Error(`Arquivo não encontrado no caminho especificado: ${fileData.file}`);
          }
          fileToUpload = fs.createReadStream(fileData.file);
        }
      } else if (fileData.file instanceof Buffer || (fileData.file && typeof fileData.file.readable === 'boolean')) {
        // Se for Buffer ou stream (objeto com propriedade 'readable' boolean)
        fileToUpload = fileData.file;
      } else {
        throw new Error("Tipo de arquivo inválido para upload. Deve ser base64, caminho string, Buffer ou Stream.");
      }

      // Chama o serviço de upload com o arquivo preparado
      const uploadResult = await this.uploadService.uploadFile(fileToUpload);

      if (!uploadResult) {
        throw new Error("Upload falhou: resultado vazio.");
      }

      return uploadResult;

    } catch (error: any) {
      // Aqui você pode logar o erro com algum logger externo se desejar
      // Exemplo: logger.error(error.message);

      // Retorna erro com mensagem clara para o fluxo de tratamento
      throw new Error(`Erro no UploadFileUseCase: ${error.message}`);
    }
  }
}