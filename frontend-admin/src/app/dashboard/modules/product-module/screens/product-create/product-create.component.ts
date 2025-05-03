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
import { FormModule } from '../../../../../shared/components/form/form.module';
import { SectionComponent } from '../../../../../shared/components/section/section.component';

@Component({
  selector: 'fuse-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    FormModule,
    SectionComponent,
  ],
})
export class ProductCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(true);
  title = signal('Adicionar Produto');
  subtitle = signal('Preencha os dados do novo produto abaixo');

  productForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.maxLength(255)]],
      sku: ['', [Validators.required]],
      category: ['', [Validators.required]],
      brand: [''],
      shortDescription: [''],
      description: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Form Data:', this.productForm.value);
      // Adicione aqui a lógica para enviar os dados do formulário
    } else {
      console.log('Formulário inválido');
    }
  }

  closeDrawer(e: Event) {
    this.drawerRef.close(e);
  }

  onHide() {
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 200);
  }
}
