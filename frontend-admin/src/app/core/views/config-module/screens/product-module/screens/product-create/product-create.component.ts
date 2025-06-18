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
import { CategoryState } from 'app/shared/store/category.state';

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
  providers: [ProductService],
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
  visible = signal(false);
  title = signal('Adicionar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');
  submitButtonLabel = signal('Salvar');

  productForm!: FormGroup;

  categories = signal([]);

  constructor() {}

  ngOnInit(): void {
    this.coreService.setPageTitle('', '');

    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      ean: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      image: [''],
      brand: [''],
      initialPrice: [0, [Validators.required]],
      finalPrice: [0, [Validators.required]],
      stock: ['', [Validators.required]],
      shortDescription: [''],
      description: ['', [Validators.required]],
      companyId: ['1'],
    });

    // pegar o id da rota, se existir
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.title.set('Editar Produto');
          this.loadProduct(id);
        } else {
          this.visible.set(true);
          this.loadProduct();
        }
      });
  }

  loadProduct(id?: string): void {
    this.categoryState.getCategoryList();
    
    if (!id) {
      return;
    }

    this.productService.getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.visible.set(true);
          this.productForm.patchValue(response.dados);
        },
        error: error => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar produto',
          });
          console.error('Erro ao carregar produto:', error);
        },
      });
  }

  getCategories() {
    
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
      .upsertProduct(this.productForm.value)
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
          this.productService.refreshProductList();
          this.onCloseDrawer();
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

  back() {
    this.onCloseDrawer();
    this.router.navigate(['dashboard/config/products'])
  }

  onCloseDrawer() {
    this.visible.set(false);
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 300);
  }
}
