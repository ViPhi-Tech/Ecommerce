import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { UserService } from '../../user.service';
import { UserState } from '../../user.state';
import { FormModule } from 'app/shared/components/form/form.module';
import { ToastModule } from 'primeng/toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SYSTEM_MODULES } from 'app/shared/constants/system-modules.constants';

@Component({
  selector: 'fuse-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    FormModule,
    ToastModule,
  ],
})
export class UserCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private userState = inject(UserState);
  private toast = inject(MessageService);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  userForm!: FormGroup;
  userId = signal<string | null>(null);
  isLoading = signal(false);
  
  // Módulos do sistema
  systemModules = SYSTEM_MODULES;

  // signals
  visible = signal(true);
  title = signal('Cadastrar Usuário');

  submitButtonLabel = signal('Cadastrar');

  constructor() {}

  ngOnInit() {
    this.initForm();
    this.checkRouteParams();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: [true],
      modules: [[], [Validators.required]], // Array de módulos selecionados
    });
  }

  checkRouteParams() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.userId.set(id);
      this.title.set('Editar Usuário');
      this.submitButtonLabel.set('Atualizar');
      this.loadUser(id);
      // Para edição, a senha não é obrigatória
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadUser(id: string) {
    this.isLoading.set(true);
    this.userService
      .getUserById(id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: response => {
          const user = response.data || response;
          this.userForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            isActive: user.isActive,
            modules: user.modules || [],
          });
          this.isLoading.set(false);
        },
        error: error => {
          console.error('Error loading user:', error);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar dados do usuário',
          });
          this.isLoading.set(false);
        },
      });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.userForm.valid) {
      this.isLoading.set(true);
      const formData = { ...this.userForm.value };

      // Se é edição, adiciona o ID
      if (this.userId()) {
        formData.id = this.userId();
      }

      // Se não há senha (edição), remove o campo
      if (!formData.password) {
        delete formData.password;
      }

      this.userService
        .upsertUser(formData)
        .pipe(takeUntilDestroyed())
        .subscribe({
          next: () => {
            this.toast.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Usuário ${this.userId() ? 'atualizado' : 'cadastrado'} com sucesso`,
            });
            this.userService.refreshUserList();
            this.onCloseDialog();
          },
          error: error => {
            console.error('Error saving user:', error);
            this.toast.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao ${this.userId() ? 'atualizar' : 'cadastrar'} usuário`,
            });
            this.isLoading.set(false);
          },
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  // Método para verificar se um módulo está selecionado
  isModuleSelected(moduleId: string): boolean {
    const selectedModules = this.userForm.get('modules')?.value || [];
    return selectedModules.includes(moduleId);
  }

  // Método para alternar a seleção de um módulo
  toggleModule(moduleId: string): void {
    const modulesControl = this.userForm.get('modules');
    const currentModules = modulesControl?.value || [];
    
    if (currentModules.includes(moduleId)) {
      // Remove o módulo se já estiver selecionado
      const updatedModules = currentModules.filter((id: string) => id !== moduleId);
      modulesControl?.setValue(updatedModules);
    } else {
      // Adiciona o módulo se não estiver selecionado
      const updatedModules = [...currentModules, moduleId];
      modulesControl?.setValue(updatedModules);
    }
  }

  // Método para selecionar todos os módulos
  selectAllModules(): void {
    const allModuleIds = this.systemModules.map(module => module.id);
    this.userForm.get('modules')?.setValue(allModuleIds);
  }

  // Método para limpar todas as seleções
  clearAllModules(): void {
    this.userForm.get('modules')?.setValue([]);
  }

  // Método para verificar se todos os módulos estão selecionados
  areAllModulesSelected(): boolean {
    const selectedModules = this.userForm.get('modules')?.value || [];
    return selectedModules.length === this.systemModules.length;
  }

  // Método para verificar se nenhum módulo está selecionado
  areNoModulesSelected(): boolean {
    const selectedModules = this.userForm.get('modules')?.value || [];
    return selectedModules.length === 0;
  }

  closeDrawer(e?: Event) {
    if (e) {
      e.preventDefault();
    }
    this.visible.set(false);
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 300);
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
