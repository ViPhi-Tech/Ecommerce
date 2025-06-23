import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderCartComponent } from 'app/dashboard/modules/order-module/components/order-cart/order-cart.component';
import { ProductListComponent } from 'app/dashboard/modules/order-module/components/product-list/product-list.component';
import { ProductSearchComponent } from 'app/dashboard/modules/order-module/components/product-search/product-search.component';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'fuse-order-products',
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.scss'],
  imports: [
    DrawerModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ProductSearchComponent,
    ProductListComponent,
    OrderCartComponent,
  ],
})
export class OrderProductsComponent implements OnInit {
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
