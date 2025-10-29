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
import { emailAsyncValidator } from 'app/shared/validators/validators';
import { HttpClient } from '@angular/common/http';
import {
  formatDocument,
  formatPhone,
  isCnpjValid,
  isCpfValid,
} from 'app/shared/utils/utils';

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
  private http = inject(HttpClient);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  clientForm = this.formBuilder.group({
    id: [''],
    fullName: ['', [Validators.required]],
    document: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    // Endereço de Cobrança
    billingAddress: this.formBuilder.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      number: ['', [Validators.required]],
      neighborhood: ['', [Validators.required, Validators.minLength(2)]],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)],
      ],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
    }),
  });

  // signals
  visible = signal(false);
  title = signal('Cadastrar Cliente');

  // Controle interno do tipo de documento
  private currentDocumentType: 'cpf' | 'cnpj' = 'cpf';

  // signals para máscaras e placeholders
  documentMask = signal('999.999.999-99');
  documentPlaceholder = signal('000.000.000-00');
  documentLabel = signal('CPF');

  constructor() {
    this.clientForm.get('email')?.addAsyncValidators(emailAsyncValidator);
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        if (params['id'] && params['id'] !== 'new') {
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
        next: ({ data }: ApiResponse) => {
          this.clientForm.patchValue({
            id: data?.id,
            fullName: data?.fullName,
            document: formatDocument(data?.document),
            email: data?.email,
            phone: formatPhone(data?.phone),
            billingAddress: {
              street: data?.billingAddress?.street || '',
              number: data?.billingAddress?.number || '',
              neighborhood: data?.billingAddress?.neighborhood || '',
              zipCode: data?.billingAddress?.zipCode || '',
              city: data?.billingAddress?.city || '',
              state: data?.billingAddress?.state || '',
            },
          });

          this.handleDocumentInput(this.clientForm.get('document')?.value);

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

    // Preparar dados incluindo o tipo de documento detectado automaticamente
    const formData = {
      ...this.clientForm.value,
      documentType: this.currentDocumentType,
    };

    this.clientService.upsertClient(formData).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: this.clientForm.value.id
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente criado com sucesso!',
        });
        this.clientService.createClientRefresh();
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

  private updateDocumentLabel(): void {
    if (this.currentDocumentType === 'cpf') {
      this.documentLabel.set('CPF');
    } else if (this.currentDocumentType === 'cnpj') {
      this.documentLabel.set('CNPJ');
    }
  }

  handleDocumentInput(value: any): void {
    value = value?.target?.value || value;

    if (!value) return;

    const numbersOnly = value.replace(/\D/g, '');
    if (this.currentDocumentType === 'cpf' && numbersOnly.length > 11) {
      this.currentDocumentType = 'cnpj';
      this.updateDocumentLabel();
    }
    if (
      this.currentDocumentType === 'cnpj' &&
      numbersOnly.length <= 11 &&
      numbersOnly.length >= 1
    ) {
      this.currentDocumentType = 'cpf';
      this.updateDocumentLabel();
    }
  }

  handleDocumentBlur(value: any): void {
    if (!value?.target?.value) return;
    const numbersOnly = value.target.value.replace(/\D/g, '');

    console.log('value', numbersOnly);
    console.log('currentDocumentType', this.currentDocumentType);

    if (this.currentDocumentType === 'cpf' && !isCpfValid(numbersOnly)) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'CPF inválido',
      });
      this.clientForm.get('document')?.setErrors({ invalid: true });
    } else if (
      this.currentDocumentType === 'cnpj' &&
      !isCnpjValid(numbersOnly)
    ) {
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'CNPJ inválido',
      });
      this.clientForm.get('document')?.setErrors({ invalid: true });
    }
  }

  /**
   * Busca endereço por CEP usando a API ViaCEP
   */
  onZipCodeBlur(event: any): void {
    const zipCode = event?.target?.value?.replace(/\D/g, '');

    if (!zipCode || zipCode.length !== 8) {
      return;
    }

    this.http
      .get(`https://viacep.com.br/ws/${zipCode}/json/`)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: any) => {
          if (response.erro) {
            this.toast.add({
              severity: 'warn',
              summary: 'Aviso',
              detail: 'CEP não encontrado',
            });
            return;
          }

          // Preencher automaticamente os campos de endereço
          this.clientForm.patchValue({
            billingAddress: {
              street: response.logradouro || '',
              neighborhood: response.bairro || '',
              city: response.localidade || '',
              state: response.uf || '',
              zipCode: this.formatZipCode(zipCode),
            },
          });

          this.toast.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Endereço preenchido automaticamente',
          });
        },
        error: () => {
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar CEP',
          });
        },
      });
  }

  /**
   * Formata CEP
   */
  private formatZipCode(zipCode: string): string {
    return zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Converte estado para maiúsculo
   */
  onStateInput(event: any): void {
    const state = event?.target?.value?.toUpperCase();
    if (state && state.length <= 2) {
      this.clientForm.patchValue({
        billingAddress: {
          ...this.clientForm.get('billingAddress')?.value,
          state: state,
        },
      });
    }
  }
}
