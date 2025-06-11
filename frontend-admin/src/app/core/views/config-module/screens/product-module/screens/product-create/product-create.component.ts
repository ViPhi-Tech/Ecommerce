import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
  selector: 'fuse-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  imports: [DrawerModule, ButtonModule, ReactiveFormsModule, FormModule],
  providers: [ProductService],
})
export class ProductCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

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
      name: ['', [Validators.required, Validators.maxLength(255)]],
      sku: ['', [Validators.required]],
      category: ['', [Validators.required]],
      image: [''],
      brand: [''],
      initialPrice: [0, [Validators.required]],
      finalPrice: [0, [Validators.required]],
      stock: ['', [Validators.required]],
      shortDescription: [''],
      description: ['', [Validators.required]],
    });

    // pegar o id da rota, se existir
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyedRef)).subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.loadProduct(id);
      }else {
        this.visible.set(true);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).pipe(takeUntilDestroyed(this.destroyedRef)).subscribe({
      next: (response: ApiResponse) => {
        this.productForm.patchValue(response.dados);
        this.visible.set(true);
      },
      error: (error: ApiResponse) => {
        console.error('Error loading product:', error);
      },
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.productForm.markAllAsTouched();
    if (!this.productForm.valid) {
      console.log('Formulário inválido');
      return;
    } 

    this.productService.createProduct(this.productForm.value).pipe(takeUntilDestroyed(this.destroyedRef)).subscribe({
      next: (response: ApiResponse) => {
        console.log('Product created successfully:', response);
        this.onCloseDrawer();
      },
      error: (error: ApiResponse) => {
        console.error('Error creating product:', error);
      },
    });

    console.log('Form Data:', this.productForm.value);
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
