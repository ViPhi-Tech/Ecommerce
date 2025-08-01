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
import { CoreService } from 'app/shared/services/core.service';
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
  private coreService = inject(CoreService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);
  public supplierState = inject(SupplierState);
  private accountsPayableService = inject(AccountsPayableService);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  title = signal('Cadastrar conta a pagar');
  subtitle = signal('Preencha os dados da nova conta a pagar abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  accountsPayableForm!: FormGroup;

  destroyedRef = inject(DestroyRef);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(true);

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.coreService.setPageTitle('', '');
    this.supplierState.getSupplierList();
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Conta a Pagar');
          this.loadInfos(id);
          this.coreService.setPageTitle(
            'Editar Conta a Pagar',
            'Preencha os dados da conta a pagar abaixo'
          );
        } else {
          this.coreService.setPageTitle(
            'Adicionar Conta a Pagar',
            'Preencha os dados da nova conta a pagar abaixo'
          );
          this.loadInfos();
        }
      });
  }

  async loadInfos(id?: number): Promise<void> {
    if (!id) {
      this.isLoading.set(false);
      return;
    }
    this.accountsPayableService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          const data = response.dados;

          // Converter as datas do formato ISO para o formato DD/MM/YYYY para exibição
          if (data.originalDueDate) {
            data.originalDueDate = dayjs(data.originalDueDate).format(
              'DD/MM/YYYY'
            );
          }
          if (data.issueDate) {
            data.issueDate = dayjs(data.issueDate).format('DD/MM/YYYY');
          }
          if (data.dueDate) {
            data.dueDate = dayjs(data.dueDate).format('DD/MM/YYYY');
          }
          if (data.competenceDate) {
            data.competenceDate = dayjs(data.competenceDate).format(
              'DD/MM/YYYY'
            );
          }

          this.accountsPayableForm.patchValue(data);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar conta a pagar',
          });
          console.error('Erro ao carregar conta a pagar:', error);
        },
      });
  }

  initForm(): void {
    this.accountsPayableForm = this.formBuilder.group({
      id: [''],
      uuid: [''],
      supplierId: ['', [Validators.required]],
      originalDueDate: [{ value: '', disabled: true }],
      issueDate: [dayjs().format('DD/MM/YYYY'), Validators.required],
      dueDate: ['', Validators.required],
      competenceDate: ['', Validators.required],
      recurringPurchase: [false],
      amount: ['', Validators.required],
      status: ['pending'],
      description: ['', [Validators.required, Validators.maxLength(255)]],
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

    // Formatar as datas para o formato ISO antes de enviar
    const payload = { ...formValue };

    // Se originalDueDate estiver vazio, definir como null ao invés de string vazia
    if (!payload.originalDueDate || payload.originalDueDate === '') {
      payload.originalDueDate = null;
    } else {
      // Converter para formato ISO date-time se tiver valor
      payload.originalDueDate = this.convertToISODateTime(
        payload.originalDueDate
      );
    }

    // Converter outras datas para formato ISO
    payload.issueDate = this.convertToISODateTime(payload.issueDate);
    payload.dueDate = this.convertToISODateTime(payload.dueDate);
    payload.competenceDate = this.convertToISODateTime(payload.competenceDate);

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

  private convertToISODateTime(dateString: string): string | null {
    if (!dateString || dateString.trim() === '') {
      return null;
    }

    try {
      // Se já estiver no formato ISO, retornar como está
      if (dateString.includes('T') && dateString.includes('Z')) {
        return dateString;
      }

      // Converter do formato DD/MM/YYYY para ISO
      const dateParts = dateString.split('/');
      if (dateParts.length === 3) {
        const day = dateParts[0].padStart(2, '0');
        const month = dateParts[1].padStart(2, '0');
        const year = dateParts[2];

        // Criar data no formato ISO com horário padrão (00:00:00)
        const isoDate = dayjs(`${year}-${month}-${day}`).toISOString();
        return isoDate;
      }

      // Tentar parsear com dayjs se não estiver no formato esperado
      const parsedDate = dayjs(dateString);
      if (parsedDate.isValid()) {
        return parsedDate.toISOString();
      }

      return null;
    } catch (error) {
      console.error('Erro ao converter data:', error);
      return null;
    }
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
}
