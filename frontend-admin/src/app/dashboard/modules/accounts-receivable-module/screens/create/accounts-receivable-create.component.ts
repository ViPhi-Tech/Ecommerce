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
import { AccountsReceivableService } from '../../accounts-receivable.service';
import { Drawer } from 'primeng/drawer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { FormModule } from 'app/shared/components/form/form.module';
import { CheckboxModule } from 'primeng/checkbox';
import { ClientState } from 'app/dashboard/modules/client-module/client.state';
import { AccountsReceivableState } from '../../accounts-receivable.state';
import { IAccountsReceivable } from 'app/shared/interfaces/accounts-receivable/AccountsReceivable';

@Component({
  selector: 'fuse-accounts-receivable-create-drawer',
  templateUrl: './accounts-receivable-create.component.html',
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    CheckboxModule,
  ],
})
export class AccountsReceivableCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);
  public clientState = inject(ClientState);
  public accountsReceivableState = inject(AccountsReceivableState);
  private accountsReceivableService = inject(AccountsReceivableService);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  title = signal('Cadastrar conta a receber');
  subtitle = signal('Preencha os dados da nova conta a receber abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);
  isView = signal(false);
  typeAction = signal<string>('');

  accountsReceivableForm!: FormGroup;

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
    this.clientState.getClientList();
    this.handleRouteParams();
    this.handleFormValueChanges();
    this.handleFormPrefill();
  }

  // Função 1: lida com params da rota
  private handleRouteParams(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Conta a Receber');
          this.loadInfos(id);
        } else {
          this.loadInfos();
        }
        const url = this.router.url
        this.isView.set(url.includes('/view'));
        if (this.isView()) {
          this.accountsReceivableForm.disable();
          this.title.set('Visualizar Conta a Receber');
        }
      })
  }

  // Função 2: validação em tempo real usando valueChanges
  private handleFormValueChanges(): void {
    this.accountsReceivableForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(() => {
        const errors = this.dateValidation(this.accountsReceivableForm);
        this.accountsReceivableForm.setErrors(errors);
      });
  }

  // Função 3: escuta para pré-preencher o formulário
  private handleFormPrefill(): void {
    this.accountsReceivableState.formPrefill$
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(data => {
        if (data && Object.keys(data).length > 0) {
          this.accountsReceivableForm.patchValue(data);
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
      uuid: [''],
      clientId: ['', [Validators.required]],
      issueDate: [dayjs().format('DD/MM/YYYY'), Validators.required],
      dueDate: ['', Validators.required],
      recurringIncome: [false],
      amount: ['', Validators.required],
      status: ['pending'],
      description: [''],
      orders: [[]],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.accountsReceivableForm.markAllAsTouched();

    const formValue = this.accountsReceivableForm.getRawValue();
    if (!this.accountsReceivableForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    const payload: any = {
      ...formValue,
      orders: formValue?.orders?.map((order: any) => order.id),
    };

    if (formValue.id) {
      payload.id = formValue.id;
    }

    this.accountsReceivableService
      .upsert(payload)
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
    const errors = this.accountsReceivableForm.errors;
    const errorMessages: string[] = [];

    if (errors?.['dueDateBeforeIssue']) {
      errorMessages.push(
        'A data de vencimento não pode ser anterior à data de emissão.'
      );
    }

    return errorMessages;
  }
}
