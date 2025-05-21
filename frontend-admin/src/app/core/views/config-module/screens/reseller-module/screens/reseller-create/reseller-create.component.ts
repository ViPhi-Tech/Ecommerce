import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { FormModule } from 'app/shared/components/form/form.module';

@Component({
  selector: 'fuse-reseller-create',
  templateUrl: './reseller-create.component.html',
  styleUrls: ['./reseller-create.component.scss'],
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FormModule],
})
export class ResellerCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('dialogRef') dialogRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(true);
  title = signal('Adicionar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');

  resellerForm!: FormGroup;

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
    this.resellerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      sku: ['', [Validators.required]],
      category: ['', [Validators.required]],
      brand: [''],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
      shortDescription: [''],
      description: ['', [Validators.required]],
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    this.resellerForm.markAllAsTouched();
    if (this.resellerForm.valid) {
      console.log('Form Data:', this.resellerForm.value);
      // Adicione aqui a lógica para enviar os dados do formulário
    } else {
      console.log('Formulário inválido');
    }
  }

  closeDrawer(e: Event) {
    this.dialogRef.close(e);
  }

  onHide() {
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 200);
  }
}
