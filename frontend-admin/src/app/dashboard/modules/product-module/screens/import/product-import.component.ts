import {
  Component,
  OnInit,
  signal,
  ViewChild,
  inject,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FileUploadComponent } from 'app/shared/components/file-upload/file-upload.component';

@Component({
  selector: 'fuse-product-import',
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.scss'],
  imports: [DialogModule, ButtonModule, FileUploadComponent],
})
export class ProductImportComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(MessageService);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(true);
  selectedFile: File | null = null;

  constructor() {}

  ngOnInit(): void {}

  onFileSelected(files: File[]): void {
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onImport(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    if (!this.selectedFile) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, selecione um arquivo para importar.',
      });
      return;
    }

    // Aqui você pode implementar a lógica de importação
    // Por exemplo, enviar o arquivo para o serviço
    this.toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produtos importados com sucesso!',
    });
    this.closeDialog();
  }

  closeDialog(e = new Event('close')): void {
    this.dialogRef.close(e);
  }

  onCloseDialog() {
    this.visible.set(false);
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 300);
  }
}
