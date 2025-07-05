import { Component, inject, OnInit, signal } from '@angular/core';
import { CoreService } from 'app/shared/services/core.service';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { FormModule } from 'app/shared/components/form/form.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImportInvoiceComponent } from 'app/shared/components/import-invoice/import-invoice.component';
import { ImportInvoiceService } from 'app/shared/components/import-invoice/import-invoice.service';

@Component({
  selector: 'fuse-stock-inbound',
  templateUrl: './stock-inbound.component.html',
  imports: [
    TabsModule,
    ButtonModule,
    FieldsetModule,
    FormModule,
    ReactiveFormsModule,
    ImportInvoiceComponent,
  ],
})
export class StockInboundComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coreService = inject(CoreService);

  private importInvoiceService = inject(ImportInvoiceService);

  nfModel = signal([
    { label: 'NF-e (Mod. 55)', value: '55', key: '55' },
    { label: 'NF (Mod. 01)', value: '01', key: '01' },
    { label: 'NF Produtor (Mod. 04)', value: '04', key: '04' },
  ]);

  inboundData: FormGroup = new FormGroup({});

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.coreService.setPageTitle(
      'Nova entrada',
      'Cadastro de nova entrada de produtos'
    );
  }

  initForm() {
    this.inboundData = this.fb.group({
      nfModel: [this.nfModel()[0].value, [Validators.required]],
    });
  }

  importXml() {
    this.importInvoiceService.openDialog(this.inboundData.getRawValue());
  }
}
