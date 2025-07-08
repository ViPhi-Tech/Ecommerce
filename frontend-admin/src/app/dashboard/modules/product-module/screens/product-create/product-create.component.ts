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
import { ProductService } from '../../product.service';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CoreService } from 'app/shared/services/core.service';
import { CategoryState } from 'app/dashboard/modules/category-module/category.state';

@Component({
  selector: 'fuse-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    ToastModule,
  ],
})
export class ProductCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private coreService = inject(CoreService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);

  private productService = inject(ProductService);
  categoryState = inject(CategoryState);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  title = signal('Adicionar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');
  submitButtonLabel = signal('Salvar');
  isLoading = signal(true);

  productForm!: FormGroup;

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
          this.title.set('Editar Produto');
          this.loadInfos(id);
          this.coreService.setPageTitle(
            'Editar Produto',
            'Preencha os dados do produto abaixo'
          );
          this.blockFields();
        } else {
          this.coreService.setPageTitle(
            'Adicionar Produto',
            'Preencha os dados do novo produto abaixo'
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
          this.back();
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

  back() {
    this.router.navigate(['dashboard/products/list']);
  }
}
