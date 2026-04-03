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
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormModule } from 'app/shared/components/form/form.module';
import { InputWithAiPanelComponent } from 'app/shared/components/input-ai-panel/input-ai-panel.component';
import { ModalComponent } from 'app/shared/components/modal/modal.component';
import { ProductService } from '../../product.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';
import { ProductState } from '../../product.state';

@Component({
  selector: 'fuse-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  imports: [
    ModalComponent,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    InputWithAiPanelComponent,
  ],
})
export class ProductCreateComponent implements OnInit {
  @ViewChild(ModalComponent) modal!: ModalComponent;

  destroyedRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);

  private productService = inject(ProductService);
  private productState = inject(ProductState);
  categoryState = inject(CategoryState);

  formGroup = this.formBuilder.group({});

  // signals
  title = signal('Cadastrar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  productForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.initForm();

    // pegar o id da rota, se existir
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Produto');
          this.subtitle.set('Preencha os dados do produto abaixo');
          this.loadInfos(id);
          this.blockFields();
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

    this.productService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.productForm.patchValue(response.dados);
          this.isLoading.set(false);
        },
        error: error => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar produto',
          });
          console.error('Erro ao carregar produto:', error);
        },
      });
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      ean: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      image: [''],
      brand: [''],
      initialPrice: [null, [Validators.min(0.01), Validators.required]],
      finalPrice: [null, [Validators.min(0.01), Validators.required]],
      icms: [null, [Validators.min(0)]],
      st: [null, [Validators.min(0)]],
      quantity: ['', [Validators.required]],
      shortDescription: [''],
      description: [''],
      companyId: ['1'],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.productForm.markAllAsTouched();
    if (!this.productForm.valid) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.productService
      .upsertProduct(this.productForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.productForm.value.id
              ? 'Produto atualizado com sucesso!'
              : 'Produto criado com sucesso!',
          });
          this.productState.getProductList();
          this.onCloseDialog();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto',
          });
        },
      });
  }

  blockFields() {
    this.productForm.get('sku')?.disable();
    this.productForm.get('ean')?.disable();
    this.productForm.get('quantity')?.disable();
  }

  onCloseDialog(): void {
    this.modal.closeModal();
  }
}
