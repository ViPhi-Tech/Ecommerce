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
import { ServiceOrderService } from '../../service-order.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ServiceOrderState } from '../../service-order.state';

@Component({
  selector: 'fuse-service-order-create',
  templateUrl: './service-order-create.component.html',
  styleUrls: ['./service-order-create.component.scss'],
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FormModule],
})
export class ServiceOrderCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);

  private serviceOrderService = inject(ServiceOrderService);
  private serviceOrderState = inject(ServiceOrderState);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(true);
  title = signal('Cadastrar Ordem de Serviço');
  subtitle = signal('Preencha os dados da nova ordem de serviço abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  serviceOrderForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.initForm();

    // pegar o id da rota, se existir
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Ordem de Serviço');
          this.subtitle.set('Preencha os dados da ordem de serviço abaixo');
          this.loadInfos(id);
          this.blockFields();
        } else {
          this.loadInfos();
        }
      });
  }

  async loadInfos(id?: string): Promise<void> {
    if (!id) {
      this.isLoading.set(false);
      return;
    }

    this.serviceOrderService
      .getServiceOrderById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.serviceOrderForm.patchValue(response.dados);
          this.isLoading.set(false);
        },
        error: error => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar ordem de serviço',
          });
          console.error('Erro ao carregar ordem de serviço:', error);
        },
      });
  }

  initForm(): void {
    this.serviceOrderForm = this.formBuilder.group({
      id: [''],
      client: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      status: ['pending', [Validators.required]],
      priority: ['medium', [Validators.required]],
      createdDate: [
        new Date().toISOString().split('T')[0],
        [Validators.required],
      ],
      dueDate: ['', [Validators.required]],
      assignedTo: ['', [Validators.required]],
      notes: [''],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.serviceOrderForm.markAllAsTouched();
    if (!this.serviceOrderForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.serviceOrderService
      .upsertServiceOrder(this.serviceOrderForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.serviceOrderForm.value.id
              ? 'Ordem de serviço atualizada com sucesso!'
              : 'Ordem de serviço criada com sucesso!',
          });
          this.serviceOrderState.getServiceOrderList();
          this.closeDialog();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar ordem de serviço',
          });
        },
      });
  }

  blockFields() {
    // Block fields if needed
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
