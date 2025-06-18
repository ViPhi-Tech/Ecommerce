import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormModule } from 'app/shared/components/form/form.module';
import { Dialog, DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../../category.service';
import { CategoryState } from 'app/shared/store/category.state';
import { CoreService } from 'app/shared/services/core.service';

@Component({
  selector: 'fuse-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    FormModule,
  ],
})
export class CategoryCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private coreService = inject(CoreService);
  private categoryService = inject(CategoryService);
  private state = inject(CategoryState);
  private toast = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  categoryForm = this.formBuilder.group({
    id: [''],
    name: ['', [Validators.required]],
  });

  // signals
  visible = signal(true);
  title = signal('Cadastrar Categoria');

  constructor() {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe((params) => {
        if (params['id']) {
          this.loadCategory(params['id']);
          this.title.set('Editar Categoria');
        } else {
          this.visible.set(true);
        }
      });
  }

  loadCategory(id: string): void {
    this.categoryService
      .getCategoryById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.categoryForm.patchValue(response.dados);
          this.visible.set(true);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar categoria',
          });
        },
      });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();


    if (this.categoryForm.invalid) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.categoryService
      .upsertCategory(this.categoryForm.value)
      .subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: this.categoryForm.value.id ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!',
          });
          
          this.state.getCategoryList();
          this.closeDialog();
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao salvar categoria',
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
