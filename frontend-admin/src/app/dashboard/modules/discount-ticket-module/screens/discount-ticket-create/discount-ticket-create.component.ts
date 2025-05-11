import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FormModule } from 'app/shared/components/form/form.module';

@Component({
  selector: 'fuse-discount-ticket-create',
  templateUrl: './discount-ticket-create.component.html',
  styleUrls: ['./discount-ticket-create.component.scss'],
  imports: [DialogModule, ButtonModule, ReactiveFormsModule, FormModule],
})
export class DiscountTicketCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  formGroup = this.formBuilder.group({});

  // signals
  visible = true;
  title = signal('Cadastrar Cupom');

  constructor() {}

  ngOnInit() {}

  closeDialog() {
    this.visible = false;
  }

  onHide() {
    setTimeout(() => {
      this.router.navigate([{ outlets: { drawer: null } }], {
        relativeTo: this.activatedRoute.root,
      });
    }, 200);
  }
}
