import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { OrderHeaderComponent } from '../../components/order-header/order-header.component';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { OrderCartComponent } from '../../components/order-cart/order-cart.component';

@Component({
  selector: 'fuse-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    OrderHeaderComponent,
    ProductSearchComponent,
    ProductListComponent,
    OrderCartComponent,
  ],
})
export class OrderCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  @ViewChild('drawerRef') drawerRef!: Drawer;

  formGroup = this.formBuilder.group({});

  // signals
  visible = signal(true);
  title = signal('Cadastrar Produto');

  constructor() {}

  ngOnInit() {}

  closeDrawer(e: Event) {
    this.drawerRef.close(e);
  }

  onCloseDrawer() {
    this.visible.set(false);
    setTimeout(() => {
      this.router
        .navigate([{ outlets: { drawer: null } }], {
          relativeTo: this.activatedRoute.root,
        })
        .then(r => {
          console.log('r', r);
        });
    }, 300);
  }
}
