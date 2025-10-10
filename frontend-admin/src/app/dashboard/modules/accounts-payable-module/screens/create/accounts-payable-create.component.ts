import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { AccountsPayableService } from '../../accounts-payable.service';
import { Drawer } from 'primeng/drawer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { FormModule } from 'app/shared/components/form/form.module';
import { CheckboxModule } from 'primeng/checkbox';
import { SupplierState } from 'app/dashboard/modules/supplier-module/supplier.state';
import { AccountsPayableState } from '../../accounts-payable.state';
import { IAccountsPayable } from 'app/shared/interfaces/accounts-payable/AccountsPayable';

@Component({
  selector: 'fuse-accounts-payable-create-drawer',
  templateUrl: './accounts-payable-create.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    CheckboxModule,
  ],
})
export class AccountsPayableCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);
  public supplierState = inject(SupplierState);
  public accountsPayableState = inject(AccountsPayableState);
  private accountsPayableService = inject(AccountsPayableService);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  title = signal('Cadastrar conta a pagar');
  subtitle = signal('Preencha os dados da nova conta a pagar abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);
  isView = signal(false);

  accountsPayableForm!: FormGroup;

  destroyedRef = inject(DestroyRef);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(false);

  dateValidation(formGroup: FormGroup): Record<string, any> | null {
    const issueDate = formGroup.get('issueDate')?.value;
    const dueDate = formGroup.get('dueDate')?.value;
    const errors: Record<string, any> = {};

    if (issueDate && dueDate) {
      const issue = dayjs(issueDate, 'DD/MM/YYYY');
      const due = dayjs(dueDate, 'DD/MM/YYYY');
      if (due.isBefore(issue)) {
        errors['dueDateBeforeIssue'] = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.supplierState.getSupplierList();
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Conta a Pagar');
          this.loadInfos(id);
        } else {
          this.loadInfos();
        }
        const url = this.router.url;
        this.isView.set(url.includes('/view'));
        if (this.isView()) {
          this.accountsPayableForm.disable();
          this.title.set('Visualizar Conta a Pagar');
        }
      });

    // Validação em tempo real usando valueChanges
    this.accountsPayableForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(() => {
        const errors = this.dateValidation(this.accountsPayableForm);
        this.accountsPayableForm.setErrors(errors);
      });

    // Escuta o Subject para pré-preencher o formulário
    this.accountsPayableState.formPrefill$
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(data => {
        if (data && Object.keys(data).length > 0) {
          this.accountsPayableForm.patchValue(data);
        }
      });
  }

  async loadInfos(id?: number): Promise<void> {
    if (!id) {
      this.isLoading.set(false);
      this.visible.set(true);
      return;
    }
    this.accountsPayableService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          const data = response.data as IAccountsPayable;

          this.accountsPayableForm.patchValue({
            ...data,
            issueDate: dayjs(data.issueDate).format('DD/MM/YYYY'),
            dueDate: dayjs(data.dueDate).format('DD/MM/YYYY'),
          });
          this.isLoading.set(false);
          this.visible.set(true);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar conta a pagar',
          });
          this.onCloseDialog();
          console.error('Erro ao carregar conta a pagar:', error);
        },
      });
  }

  initForm(): void {
    this.accountsPayableForm = this.formBuilder.group({
      id: [''],
      uuid: [''],
      supplierId: ['', [Validators.required]],
      issueDate: [dayjs().format('DD/MM/YYYY'), Validators.required],
      dueDate: ['', Validators.required],
      recurringPurchase: [false],
      amount: ['', Validators.required],
      status: ['pending'],
      description: [''],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.accountsPayableForm.markAllAsTouched();

    const formValue = this.accountsPayableForm.getRawValue();
    if (!this.accountsPayableForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    const payload = { ...formValue };

    this.accountsPayableService
      .upsert(payload)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.accountsPayableForm.value.id
              ? 'Conta a pagar atualizada com sucesso!'
              : 'Conta a pagar criada com sucesso!',
          });
          this.accountsPayableState.getAccountsPayableList();
          this.back();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar conta a pagar',
          });
        },
      });
  }

  back() {
    this.router.navigate([{ outlets: { drawer: null } }], {
      relativeTo: this.activatedRoute.root,
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

  get dateErrors(): string[] {
    const errors = this.accountsPayableForm.errors;
    const errorMessages: string[] = [];

    if (errors?.['dueDateBeforeIssue']) {
      errorMessages.push(
        'A data de vencimento não pode ser anterior à data de emissão.'
      );
      this.accountsPayableForm.get('dueDate')?.setErrors({ incorrect: true });
    } else {
      this.accountsPayableForm.get('dueDate')?.setErrors(null);
    }

    return errorMessages;
  }
}
