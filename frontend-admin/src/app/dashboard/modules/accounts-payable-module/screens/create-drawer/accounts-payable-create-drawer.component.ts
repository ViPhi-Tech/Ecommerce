import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { AccountsPayableFormComponent } from '../../components/form/accounts-payable-form.component';

@Component({
  selector: 'fuse-accounts-payable-create-drawer',
  template: `
    <p-dialog
      #dialogRef
      [(visible)]="visible"
      (onHide)="onCloseDialog()"
      [modal]="true"
      [closeOnEscape]="true"
      [draggable]="false"
      styleClass="max-w-[600px] w-full"
    >
      <ng-template #header>
        <div class="flex flex-col">
          <div class="flex flex-col space-y-1.5 text-center sm:text-left">
            <h2 class="text-2xl font-semibold leading-none tracking-tight">
              {{ title() }}
            </h2>
            <p class="text-sm text-muted-foreground">
              Preencha os dados da nova conta a pagar abaixo
            </p>
          </div>
        </div>
      </ng-template>

      <fuse-accounts-payable-form #formComponent/>

      <ng-template #footer>
        <div class="flex gap-2">
          <button
            pButton
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            (click)="closeDialog()"
            outlined="true"
            severity="secondary"
            class="w-[200px]"
            size="small"
          ></button>

          <button
            pButton
            type="submit"
            [label]="submitButtonLabel()"
            icon="pi pi-check"
            class="w-[200px]"
            size="small"
            (click)="onSubmit($event)"
          ></button>
        </div>
      </ng-template>
      
    </p-dialog>
  `,
  imports: [
    DialogModule,
    ButtonModule,
    AccountsPayableFormComponent
  ],
})
export class AccountsPayableCreateDrawerComponent implements OnInit {
  @ViewChild('formComponent') formComponent!: AccountsPayableFormComponent;

  destroyedRef = inject(DestroyRef);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(true);
  title = signal('Cadastrar conta a pagar');

  submitButtonLabel = signal('Salvar');

  constructor() {}

  ngOnInit() {}

  closeDialog(e = new Event('close')): void {
    this.dialogRef.close(e);
  }

  onSave() {
    console.log('Save action triggered');
    this.onCloseDialog();
  }

  onSubmit(event: any) {
    this.formComponent.onSubmit(event);
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
