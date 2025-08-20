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
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FormModule } from 'app/shared/components/form/form.module';
import { AccountsReceivableService } from '../../accounts-receivable.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AccountsReceivableState } from '../../accounts-receivable.state';
import { IAccountsReceivable } from 'app/shared/interfaces/accounts-receivable/AccountsReceivable';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-accounts-receivable-create',
  templateUrl: './accounts-receivable-create.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    ToastModule,
  ],
})
export class AccountsReceivableCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);
  private accountsReceivableService = inject(AccountsReceivableService);
  public accountsReceivableState = inject(AccountsReceivableState);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  formGroup = this.formBuilder.group({});

  title = signal('Adicionar Conta a Receber');
  subtitle = signal('Preencha os dados da nova conta a receber abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);
  isView = signal(false);
  visible = signal(true);

  accountsReceivableForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Conta a Receber');
          this.subtitle.set('Preencha os dados da conta a receber abaixo');
          this.loadInfos(id);
        } else {
          this.loadInfos();
        }
        const url = this.router.url;
        this.isView.set(url.includes('/view'));
        if (this.isView()) {
          this.accountsReceivableForm.disable();
          this.title.set('Visualizar Conta a Receber');
        }
      });
  }

  async loadInfos(id?: string): Promise<void> {
    if (!id) {
      this.isLoading.set(false);
      this.visible.set(true);
      return;
    }
    this.accountsReceivableService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          const data = response.data as IAccountsReceivable;

          this.accountsReceivableForm.patchValue({
            ...data,
            dueDate: data.dueDate
              ? dayjs(data.dueDate).format('DD/MM/YYYY')
              : '',
          });
          this.isLoading.set(false);
          this.visible.set(true);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar conta a receber',
          });
          this.onCloseDialog();
          console.error('Erro ao carregar conta a receber:', error);
        },
      });
  }

  initForm(): void {
    this.accountsReceivableForm = this.formBuilder.group({
      id: [''],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      dueDate: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.accountsReceivableForm.markAllAsTouched();

    const formValue = this.accountsReceivableForm.getRawValue();
    console.log('Form Value:', formValue);

    if (!this.accountsReceivableForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.accountsReceivableService
      .upsert(formValue)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.accountsReceivableForm.value.id
              ? 'Conta a receber atualizada com sucesso!'
              : 'Conta a receber criada com sucesso!',
          });
          this.accountsReceivableState.getAccountsReceivableList();
          this.back();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao salvar conta a receber',
          });
        },
      });
  }

  back() {
    // remover outlet da url
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
}
