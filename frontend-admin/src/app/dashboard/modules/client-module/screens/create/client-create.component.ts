import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import { ClientService } from '../../client.service';
import { ClientState } from '../../client.state';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'fuse-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    FormModule,
    InputMaskModule,
  ],
})
export class ClientCreateComponent implements OnInit {
  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private clientService = inject(ClientService);
  private state = inject(ClientState);
  private toast = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  clientForm = this.formBuilder.group({
    id: [''],
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    document: [''],
    address: [''],
    city: [''],
    state: [''],
    zipCode: [''],
    notes: [''],
  });

  // signals
  visible = signal(true);
  title = signal('Cadastrar Cliente');

  constructor() {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        if (params['id']) {
          this.loadClient(params['id']);
          this.title.set('Editar Cliente');
        } else {
          this.visible.set(true);
        }
      });
  }

  loadClient(id: string): void {
    this.clientService
      .getClientById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse) => {
          this.clientForm.patchValue(response.dados);
          this.visible.set(true);
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar cliente',
          });
        },
      });
  }

  onSubmit(): void {
    this.clientForm.markAllAsTouched();

    if (this.clientForm.invalid) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.clientService.upsertClient(this.clientForm.value).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.clientForm.value.id
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente criado com sucesso!',
        });

        this.state.getClientList();
        this.closeDialog();
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao salvar cliente',
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
