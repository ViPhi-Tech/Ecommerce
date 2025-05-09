import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { FormModule } from '../../../../../shared/components/form/form.module';
import { FileUploadModule } from 'primeng/fileupload';
import { XmlUtils } from '../../../../../shared/utils/xml.utils';
import { InvoiceDetailsComponent } from '../../../../../shared/components/invoice-details/invoice-details.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'fuse-import-invoice',
  templateUrl: './import-invoice.component.html',
  styleUrls: ['./import-invoice.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    FileUploadModule,
    InvoiceDetailsComponent,
    FileUploadComponent,
  ],
})
export class ImportInvoiceComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(true);
  title = signal('Importar Nota Fiscal');
  subtitle = signal(
    'Você pode importar uma nota fiscal eletrônica (NF-e) através do arquivo XML.'
  );

  uploadedFiles: any[] = [];

  invoices = signal<any[]>([]);

  constructor() {}

  ngOnInit(): void {}

  onUpload(files: any) {
    console.log('event', files);

    if (files?.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const xmlString = reader.result as string;
        try {
          let invoice = await XmlUtils.xmlToJson(xmlString);
          invoice = XmlUtils.beautifyNFe(invoice);
          this.invoices.update(invoices => [...invoices, invoice]);
          console.log('JSON convertido:', invoice);
        } catch (error) {
          console.error('Erro ao converter XML:', error);
        }
      };

      reader.readAsText(file);
    }
  }

  closeDrawer(e: Event) {
    this.drawerRef.close(e);
  }

  onHide() {
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 200);
  }
}
