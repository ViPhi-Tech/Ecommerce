import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormModule } from 'app/shared/components/form/form.module';
import { Dialog, DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { MessageService } from 'primeng/api';
import { SupplierService } from '../../supplier.service';
import { SupplierState } from '../../supplier.state';

@Component({
  selector: 'fuse-supplier-create',
  templateUrl: './supplier-create.component.html',
  styleUrls: ['./supplier-create.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    FormModule,
  ],
})
export class SupplierCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private supplierService = inject(SupplierService);
  private state = inject(SupplierState);
  private toast = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  supplierForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
    tradeName: [''],
    cnpj: [''],
    cpf: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    contactPerson: [''],
    description: [''],
    address: this.formBuilder.group({
      street: [''],
      number: [''],
      complement: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      zipCode: [''],
    }),
  });

  // signals
  visible = signal(true);
  title = signal('Cadastrar Fornecedor');

  constructor() {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        if (params['id']) {
          this.loadSupplier(params['id']);
          this.title.set('Editar Fornecedor');
        } else {
          this.visible.set(true);
        }
      });
  }

  loadSupplier(id: string): void {
    this.supplierService
      .getSupplierById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.supplierForm.patchValue(response.dados);
          this.visible.set(true);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar fornecedor',
          });
        },
      });
  }

  onSubmit(): void {
    this.supplierForm.markAllAsTouched();

    if (this.supplierForm.invalid) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.supplierService.upsertSupplier(this.supplierForm.value).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.supplierForm.value.id
            ? 'Fornecedor atualizado com sucesso!'
            : 'Fornecedor criado com sucesso!',
        });

        this.state.getSupplierList();
        this.closeDialog();
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar fornecedor',
        });
      },
    });
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
