import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  OnDestroy,
  effect,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'app/shared/services/core.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableConfig } from 'app/shared/interfaces/table.interfaces';
import { InvoiceService } from '../../invoice.service';
import { InvoiceDetails } from 'app/shared/interfaces/invoice.interface';

@Component({
  selector: 'fuse-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  imports: [TableComponent],
})
export class InvoiceListComponent implements OnInit, OnDestroy {
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private coreService = inject(CoreService);

  invoices = signal<InvoiceDetails[]>([]);
  loading = signal(false);

  tableConfig: WritableSignal<TableConfig> = signal({
    rowsPerPageOptions: [5, 10, 20],
    rowsPerPage: 10,
    paginator: true,
    pageLinkSize: 5,
    columns: [
      { field: 'id', caption: 'ID', sortable: true, filter: true },
      { field: 'name', caption: 'Nome', sortable: true, filter: true },
      { field: 'price', caption: 'Preço', sortable: true, filter: true },
      { field: 'category', caption: 'Categoria', sortable: true, filter: true },
    ],
    headerButtons: [
      {
        icon: 'pi pi-upload',
        color: 'secondary',
        outline: true,
        label: 'Importar',
        action: () => {
          this.router.navigate([
            { outlets: { drawer: ['import', 'invoice'] } },
          ]);
        },
      },
      {
        icon: 'pi pi-plus',
        label: 'Adicionar',
        action: () => {
          this.router.navigate([{ outlets: { drawer: ['invoices', 'new'] } }]);
        },
      },
    ],
  });

  title = '';

  constructor() {
    effect(() => {
      if (this.invoiceService.import$()) {
        console.log(this.invoiceService.import$());
      }
    });
  }

  ngOnInit() {
    this.activateRoute.data.subscribe(data => {
      this.coreService.adicionarBreadcrumb(data['breadcrumb']);
    });
  }

  ngOnDestroy(): void {}
}
