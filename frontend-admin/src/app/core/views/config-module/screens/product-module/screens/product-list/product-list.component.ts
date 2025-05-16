import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { FormModule } from 'app/shared/components/form/form.module';
import { ProductState } from 'app/shared/store/product.state';
import { TableFilterComponent } from 'app/shared/components/table/components/table-filter/table-filter.component';

@Component({
  selector: 'fuse-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [TableComponent, FormModule, TableFilterComponent],
})
export class ProductListComponent implements OnInit {
  private router = inject(Router);
  private coreService = inject(CoreService);
  state = inject(ProductState);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      {
        field: 'price',
        caption: 'Preço',
        type: 'currency',
        sortable: true,
        filter: true,
      },
      { field: 'category', caption: 'Categoria', sortable: true, filter: true },
    ],
    headerButtons: [
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        tooltip: 'Adicionar Produto',
        action: () => {
          // Exemplo de navegação para o outlet auxiliar "drawer"
          this.router.navigate([{ outlets: { drawer: ['products', 'new'] } }]);
        },
      },
    ],
  });

  title = '';

  categorias = signal([
    { label: 'Dinheiro', value: 'money' },
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cartão de Débito', value: 'debit_card' },
    { label: 'Transferência', value: 'transfer' },
    { label: 'Boleto', value: 'boleto' },
    { label: 'Pix', value: 'pix' },
    { label: 'Cheque', value: 'check' },
    { label: 'Vale', value: 'voucher' },
  ]);
  constructor() {}

  ngOnInit() {
    this.state.getProductList();
    this.coreService.setPageTitle('Produtos', 'Lista de produtos disponíveis');
  }

  log() {
    console.log('log');
  }
}
