import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { CoreService } from 'app/shared/services/core.service';
import { MessageService } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { AccountsPayableService } from '../../accounts-payable.service';
import { FormModule } from 'app/shared/components/form/form.module';
import { CheckboxModule } from 'primeng/checkbox';
import dayjs from 'dayjs';

@Component({
  selector: 'fuse-accounts-payable-form',
  templateUrl: './accounts-payable-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormModule,
    CheckboxModule
  ]
})
export class AccountsPayableFormComponent implements OnInit {
destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private coreService = inject(CoreService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);
  private accountsPayableService = inject(AccountsPayableService);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  title = signal('Adicionar Conta a Pagar');
  subtitle = signal('Preencha os dados da nova conta a pagar abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  accountsPayableForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.coreService.setPageTitle('', '');
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

  async loadInfos(id?: string): Promise<void> {
    if (!id) {
      this.isLoading.set(false);
      return;
    }
    this.accountsPayableService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.accountsPayableForm.patchValue(response.dados);
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
      provider: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      dueDateOriginal: [{value: '', disabled: true}],
      issueDate: [dayjs().format('DD/MM/YYYY'), Validators.required],
      dueDate: ['', Validators.required],
      competenceDate: ['', Validators.required],
      recurringPurchase: [false],
      amount: ['', Validators.required],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.accountsPayableForm.markAllAsTouched();

    const formValue = this.accountsPayableForm.getRawValue();
    console.log('Form Value:', formValue);
    if (!this.accountsPayableForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }
    
    
    this.accountsPayableService
      .upsert(formValue)
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

  back() {
    this.router.navigate(['dashboard/accounts-payable/list']);
  }
}
