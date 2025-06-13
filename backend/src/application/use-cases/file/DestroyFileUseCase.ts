import { DestroyFileDTO } from "../../dto/file/DestroyFile";
import { IFileService } from "../../../domain/services/IFileService";

export class DestroyFileUseCase {
  constructor(private fileService: IFileService) {}

  async execute(fileData: DestroyFileDTO): Promise<string> {
    return this.fileService.destroyFile(fileData.file);
  }
}