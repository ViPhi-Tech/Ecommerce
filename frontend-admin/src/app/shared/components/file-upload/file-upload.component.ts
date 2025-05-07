import { FileUploadModule } from "primeng/fileupload";
import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren, OnInit,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";

interface Image {
  file: File;
  name: string;
  objectURL: string;
  size: number;
}
@Component({
  selector: "fuse-file-upload",
  imports: [CommonModule, FileUploadModule, ButtonModule],
  templateUrl: "./file-upload.component.html",
  styleUrl: "./file-upload.component.scss",
})
export class FileUploadComponent implements OnInit {

  multiple = input<boolean>(false)
  uploadInterno = input<boolean>(true);
  loading = input<boolean>(false);
  maxFileSize = input<number>(0);
  accept = input<string>('image/*, application/*, text/*');

  uploadedFiles = signal<Image[]>([]);

  @Output() uploadedFilesPaths = new EventEmitter<Image[]>();
  @Output() uploadedFilesEvent = new EventEmitter<any[]>();
  @ViewChildren("buttonEl") buttonEl!: QueryList<ElementRef>;
  @ViewChild("previewImagem") previewImagem!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {  }

  choose(event: unknown, callback: () => void) {
    callback();
  }

  onUpload(event: any) {
    if (event) {
      const uploadFiles = [...event.files];
      this.uploadedFilesEvent.emit(uploadFiles);
    }
  }

  deleteFile(event: Event, file: Image) {
    const files = this.uploadedFiles();
    const index = files.indexOf(file);
    if (index > -1) {
      const updatedFiles = [...files.slice(0, index), ...files.slice(index + 1)];
      this.uploadedFiles.set(updatedFiles);
      this.uploadedFilesEvent.emit(updatedFiles);
    }
  }
}
