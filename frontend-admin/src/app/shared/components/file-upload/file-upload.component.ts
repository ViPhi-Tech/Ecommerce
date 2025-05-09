import { FileUpload } from 'primeng/fileupload';
import {
  Component,
  ElementRef,
  EventEmitter,
  input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';

interface Image {
  file: File;
  name: string;
  objectURL: string;
  size: number;
}

@Component({
  selector: 'fuse-file-upload',
  imports: [FileUpload, ButtonModule, BadgeModule, ToastModule],
  providers: [MessageService],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent implements OnInit {
  private config = inject(PrimeNG);
  private messageService = inject(MessageService);

  multiple = input<boolean>(false);
  uploadInterno = input<boolean>(true);
  loading = input<boolean>(false);
  maxFileSize = input<number>(0);
  accept = input<string>('image/*, application/*, text/*');

  @Output() uploadedFilesPaths = new EventEmitter<Image[]>();
  @Output() uploadedFilesEvent = new EventEmitter<any[]>();
  @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;
  @ViewChild('previewImagem') previewImagem!: TemplateRef<any>;

  files = signal<File[]>([]);
  totalSize = signal<number>(0);
  totalSizePercent = signal<number>(0);

  constructor() {}

  ngOnInit(): void {}

  choose(event: any, callback: () => void) {
    event.preventDefault();
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: File,
    removeFileCallback: (event: any, index: number) => void,
    index: number
  ) {
    removeFileCallback(event, index);
    this.totalSize.update(size => size - parseInt(this.formatSize(file.size)));
    this.totalSizePercent.set(this.totalSize() / 10);
  }

  onClearTemplatingUpload(clear: () => void) {
    clear();
    this.totalSize.set(0);
    this.totalSizePercent.set(0);
  }

  onTemplatedUpload() {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded',
      life: 3000,
    });
  }

  onSelectedFiles(event: any) {
    this.files.set(event.currentFiles);
    this.files().forEach(file => {
      this.totalSize.update(
        size => size + parseInt(this.formatSize(file.size))
      );
    });
    this.totalSizePercent.set(this.totalSize() / 10);
    this.uploadedFilesEvent.emit(this.files());
  }

  uploadEvent(callback: () => void) {
    callback();
  }

  formatSize(bytes: number): string {
    const k = 1024;
    const dm = 3;
    const sizes = this.config?.translation?.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${(sizes ?? ['Bytes'])[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${(sizes ?? ['Bytes'])[i]}`;
  }
}
