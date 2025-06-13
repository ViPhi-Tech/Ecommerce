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

@Component({
  selector: 'fuse-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  imports: [DrawerModule, ButtonModule, ReactiveFormsModule, FormModule],
  providers: [ProductService, MessageService],
})
export class ProductCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private toast = inject(MessageService);

  private productService = inject(ProductService);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(false);
  title = signal('Adicionar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');

  productForm!: FormGroup;

  categories = signal([
    { label: 'Eletrônicos', value: 'eletronicos' },
    { label: 'Roupas', value: 'roupas' },
    { label: 'Alimentos', value: 'alimentos' },
    { label: 'Móveis', value: 'moveis' },
    { label: 'Brinquedos', value: 'brinquedos' },
    { label: 'Livros', value: 'livros' },
    { label: 'Beleza', value: 'beleza' },
    { label: 'Esportes', value: 'esportes' },
    { label: 'Saúde', value: 'saude' },
  ]);

  brands = signal([
    { label: 'Apple', value: 'apple' },
    { label: 'Samsung', value: 'samsung' },
    { label: 'Sony', value: 'sony' },
    { label: 'LG', value: 'lg' },
    { label: 'Nike', value: 'nike' },
    { label: 'Adidas', value: 'adidas' },
    { label: 'Puma', value: 'puma' },
    { label: 'Reebok', value: 'reebok' },
  ]);

  constructor() {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      ean: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      category: ['', [Validators.required]],
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
          this.loadProduct(id);
        } else {
          this.visible.set(true);
            // Gerar um número aleatório de 13 dígitos diretamente no objeto
            this.productForm.patchValue({
              name: 'teste ',
              ean: Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join(''),
              sku: Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join(''),
              category: 'categoria',
              image: '',
              brand: 'marca',
              initialPrice: 90,
              finalPrice: 150,
              stock: 90,
              shortDescription: 'Descrição curta',
              description: 'Descrição longa',
            });
        }
      });
  }

  loadProduct(id: string): void {
    this.productService
      .getProductById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.productForm.patchValue(response.dados);
          this.visible.set(true);
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto carregado com sucesso!',
          });
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar produto',
          });
        },
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
      .upsertProduct(this.productForm.value)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto criado com sucesso!',
          });
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

  closeDrawer(e: Event) {
    this.drawerRef.close(e);
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
