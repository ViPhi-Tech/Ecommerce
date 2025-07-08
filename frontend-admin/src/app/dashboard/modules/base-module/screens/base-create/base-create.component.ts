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
import { Drawer, DrawerModule } from 'primeng/drawer';
import { FormModule } from 'app/shared/components/form/form.module';
import { BaseService } from '../../base.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CoreService } from 'app/shared/services/core.service';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';

@Component({
  selector: 'fuse-base-create',
  templateUrl: './base-create.component.html',
  styleUrls: ['./base-create.component.scss'],
  standalone: true,
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    ToastModule,
  ],
})
export class BaseCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private coreService = inject(CoreService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);

  private baseService = inject(BaseService);
  categoryState = inject(CategoryState);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  title = signal('Adicionar Base');
  subtitle = signal('Preencha os dados do novo base abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  baseForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.coreService.setPageTitle('', '');

    this.initForm();

    // pegar o id da rota, se existir
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Base');
          this.loadInfos(id);
          this.coreService.setPageTitle(
            'Editar Base',
            'Preencha os dados do base abaixo'
          );
          this.blockFields();
        } else {
          this.coreService.setPageTitle(
            'Adicionar Base',
            'Preencha os dados do novo base abaixo'
          );
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

    this.baseService
      .getBaseById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.baseForm.patchValue(response.dados);
          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar base',
          });
          console.error('Erro ao carregar base:', error);
        },
      });
  }

  initForm(): void {
    this.baseForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      ean: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      image: [''],
      brand: [''],
      initialPrice: [0, [Validators.min(0.01), Validators.required]],
      finalPrice: [0, [Validators.min(0.01), Validators.required]],
      quantity: ['', [Validators.required]],
      shortDescription: [''],
      description: ['', [Validators.required]],
      companyId: ['1'],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.baseForm.markAllAsTouched();
    if (!this.baseForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.baseService
      .upsertBase(this.baseForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.baseForm.value.id
              ? 'Base atualizado com sucesso!'
              : 'Base criado com sucesso!',
          });
          this.back();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar base',
          });
        },
      });
  }

  blockFields() {
    this.baseForm.get('sku')?.disable();
    this.baseForm.get('ean')?.disable();
    this.baseForm.get('quantity')?.disable();
  }

  back() {
    this.router.navigate(['dashboard/bases/list']);
  }
}
