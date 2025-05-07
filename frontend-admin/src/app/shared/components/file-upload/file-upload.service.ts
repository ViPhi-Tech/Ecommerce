import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environments } from "../../../../environments/environments";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private readonly API_BACK = `${environments.apiUrl}`;
  data: any;

  constructor(
    private http: HttpClient,
  ) {}

  fileUpload(dados: any, diretorio: string): Observable<any> {
    const data = { arquivo: dados.currentFiles, diretorio: diretorio };
    return this.http.post<any>(this.API_BACK + "core/arquivo/salvar", data);
  }
  
  deleteFile(arquivo: any): Observable<any> {
    const data = { lista_arquivos: arquivo };
    return this.http.post<any>(this.API_BACK + "core/arquivo/deletar", data);
  }

  downloadFile(data: any, diretorio: string): Observable<any> {
    data.diretorio = diretorio;
    return this.http.post<any>(this.API_BACK + "core/arquivo/download", data);
  }
}
