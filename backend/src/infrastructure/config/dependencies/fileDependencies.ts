import { UploadFileUseCase } from "../../../application/use-cases/file/UploadFileUseCase";
import { DestroyFileUseCase } from "../../../application/use-cases/file/DestroyFileUseCase";
import { FileService } from "../../services/FileService";
import { FileController } from "../../http/controllers/FileController";

export const fileService = new FileService();

export const uploadFileUseCase = new UploadFileUseCase(fileService);
export const destroyFileUseCase = new DestroyFileUseCase(fileService);

export const fileController = new FileController(
    uploadFileUseCase,
    destroyFileUseCase
);

