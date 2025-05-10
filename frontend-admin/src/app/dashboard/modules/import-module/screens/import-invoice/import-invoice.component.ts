import {
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
  OnDestroy,
} from '@angular/core';
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
import { Subscription } from 'rxjs';
import { InvoiceService } from '../../../invoice-module/invoice.service';
import { InvoiceDetails } from '../../../../../shared/interfaces/invoice.interface';
import { ApiResponse } from '../../../../../shared/interfaces/api-response.interface';

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
export class ImportInvoiceComponent implements OnInit, OnDestroy {
  private invoiceService = inject(InvoiceService);
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

  invoices = signal<InvoiceDetails[]>([]);

  private _importSubscription: Subscription | undefined;

  constructor() {}

  ngOnInit(): void {}

  onUpload(files: any) {
    if (files?.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const xmlString = reader.result as string;
        try {
          let invoice = await XmlUtils.xmlToJson(xmlString);
          invoice = XmlUtils.beautifyNFe(invoice);
          this.invoices.update(invoices => [...invoices, invoice]);
        } catch (error) {
          console.error('Erro ao converter XML:', error);
        }
      };

      reader.readAsText(file);
    }
  }

  import() {
    this._importSubscription = this.invoiceService
      .importInvoice(this.invoices()[0])
      .subscribe({
        next: (response: ApiResponse) => {
          this.invoiceService.updateimportInvoice(response?.data);
          this.closeDrawer();
        },
      });
  }

  closeDrawer(e: Event = new Event('click')) {
    this.drawerRef?.close(e);
  }

  onHide() {
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 200);
  }

  ngOnDestroy(): void {
    this._importSubscription?.unsubscribe();
  }
}
