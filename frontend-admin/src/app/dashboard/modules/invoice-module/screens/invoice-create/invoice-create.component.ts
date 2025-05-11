import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormModule } from 'app/shared/components/form/form.module';

@Component({
  selector: 'fuse-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss'],
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    FormModule,
  ],
})
export class InvoiceCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  invoiceForm!: FormGroup;

  // signals
  visible = signal(true);
  title = signal('Cadastro de Nota Fiscal');

  paymentMethods = signal([
    { label: 'Dinheiro', value: 'money' },
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cartão de Débito', value: 'debit_card' },
    { label: 'Transferência', value: 'transfer' },
    { label: 'Boleto', value: 'boleto' },
    { label: 'Pix', value: 'pix' },
    { label: 'Cheque', value: 'check' },
    { label: 'Vale', value: 'voucher' },
  ]);

  constructor() {}

  ngOnInit() {
    this.invoiceForm = this.formBuilder.group({
      numeroNF: ['', Validators.required],
      serie: ['', Validators.required],
      dataEmissao: ['', Validators.required],
      emitente: this.formBuilder.group({
        cnpj: ['', Validators.required],
        nome: ['', Validators.required],
      }),
      destinatario: this.formBuilder.group({
        cnpj: ['', Validators.required],
        nome: ['', Validators.required],
      }),
      itens: this.formBuilder.array([]),
      valores: this.formBuilder.group({
        valorTotal: [0, [Validators.required, Validators.min(0)]],
        formaPagamento: ['', Validators.required],
        naturezaOperacao: ['', Validators.required],
      }),
    });
  }

  get itens(): FormArray {
    return this.invoiceForm.get('itens') as FormArray;
  }

  addItem(): void {
    const itemForm = this.formBuilder.group({
      descricao: ['', Validators.required],
      quantidade: [1, Validators.required],
      valorUnitario: [0, [Validators.required, Validators.min(0)]],
    });
    this.itens.push(itemForm);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      console.log(this.invoiceForm.value);
    }
  }

  closeDrawer(e: Event) {
    this.drawerRef.close(e);
  }

  onCloseDrawer() {
    this.visible.set(false);
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 300);
  }
}
