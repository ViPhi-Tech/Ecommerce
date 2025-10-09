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
import { DebtService } from '../../debt.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { DebtState } from '../../debt.state';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';

@Component({
  selector: 'fuse-debt-create',
  templateUrl: './debt-create.component.html',
  styleUrls: ['./debt-create.component.scss'],
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FormModule],
})
export class DebtCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);

  private debtService = inject(DebtService);
  private debtState = inject(DebtState);
  categoryState = inject(CategoryState);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(true);
  title = signal('Cadastrar Dívida');
  subtitle = signal('Preencha os dados da nova dívida abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  debtForm!: FormGroup;

  statusOptions = signal([
    { label: 'Pendente', value: 'pending' },
    { label: 'Paga', value: 'paid' },
    { label: 'Vencida', value: 'overdue' },
    { label: 'Cancelada', value: 'cancelled' },
  ]);

  constructor() {}

  ngOnInit(): void {
    this.initForm();

    // pegar o id da rota, se existir
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Dívida');
          this.subtitle.set('Preencha os dados da dívida abaixo');
          this.loadInfos(id);
        } else {
          this.loadInfos();
        }
      });
  }

  async loadInfos(id?: string): Promise<void> {
    await this.categoryState.getCategoryList();

    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.debtService
      .getDebtById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.debtForm.patchValue(response.dados);
          this.isLoading.set(false);
        },
        error: error => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar dívida',
          });
          console.error('Erro ao carregar dívida:', error);
        },
      });
  }

  initForm(): void {
    this.debtForm = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      amount: [0, [Validators.min(0.01), Validators.required]],
      dueDate: ['', [Validators.required]],
      paidDate: [''],
      status: ['pending', [Validators.required]],
      creditorName: ['', [Validators.required, Validators.maxLength(255)]],
      creditorDocument: [''],
      categoryId: [''],
      companyId: ['1'],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.debtForm.markAllAsTouched();
    if (!this.debtForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.debtService
      .upsertDebt(this.debtForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.debtForm.value.id
              ? 'Dívida atualizada com sucesso!'
              : 'Dívida criada com sucesso!',
          });
          this.debtState.getDebtList();
          this.closeDialog();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao salvar dívida',
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
