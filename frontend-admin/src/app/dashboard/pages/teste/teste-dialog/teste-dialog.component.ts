import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormModule } from 'app/shared/components/form/form.module';
import { ModalComponent } from 'app/shared/components/modal/modal.component';

@Component({
  selector: 'fuse-teste-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormModule, ModalComponent, ButtonModule],
  templateUrl: './teste-dialog.component.html',
})
export class TesteDialogComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  title = signal('Dialog de Teste');

  testeForm = this.formBuilder.group({
    nome: ['', [Validators.required]],
    descricao: [''],
  });

  constructor() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.title.set('Editar – Teste');
    }
  }

  onCloseDialog(): void {
    this.router.navigate([{ outlets: { drawer: null } }], {
      relativeTo: this.activatedRoute.root,
    });
  }

  onSubmit(): void {
    if (this.testeForm.invalid) {
      this.testeForm.markAllAsTouched();
      return;
    }
    this.onCloseDialog();
  }
}
