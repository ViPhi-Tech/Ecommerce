import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  Signal,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DeliveryState } from '../../delivery.state';
import { CoreService } from 'app/shared/services/core.service';
import { OrderState } from 'app/dashboard/modules/order-module/order.state';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { Delivery, DeliveryStatus } from '../../interfaces/delivery.interface';
import { Order } from 'app/dashboard/modules/order-module/interfaces/order.interface';
import { TableComponent } from 'app/shared/components/table/table.component';
import {
  DEFAULT_TABLE_CONFIG,
  TableConfig,
} from 'app/shared/interfaces/table.interfaces';

@Component({
  selector: 'fuse-delivery-create',
  templateUrl: './delivery-create.component.html',
  styleUrls: ['./delivery-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    TableComponent,
  ],
  providers: [DeliveryState],
})
export class DeliveryCreateComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private coreService = inject(CoreService);
  private deliveryState = inject(DeliveryState);
  orderState = inject(OrderState);
  private fb = inject(FormBuilder);
  private toast = inject(MessageService);

  deliveryForm!: FormGroup;
  isEditMode = signal(false);
  deliveryId = signal<string | null>(null);
  selectedOrders = signal<Set<string | number>>(new Set());
  availableOrders = signal<Order[]>([]);

  selectedOrdersList = computed(() => {
    const selected = this.selectedOrders();
    return this.availableOrders().filter(order => selected.has(order.id));
  });

  totalValue = computed(() => {
    return this.selectedOrdersList().reduce((sum, order) => sum + (order.total || 0), 0);
  });

  tableConfig = signal<TableConfig>(DEFAULT_TABLE_CONFIG);

  constructor() {
    this.initForm();
    // Effect para observar mudanças na lista de pedidos
    effect(() => {
      const orders = this.orderState.orderList();
      // Filtrar apenas pedidos que podem ser entregues (ex: status específico)
      this.availableOrders.set(orders);
    });
  }

  ngOnInit() {
    this.loadDeliveryData();
    this.loadAvailableOrders();
    this.setTableConfig();
  }

  private initForm() {
    this.deliveryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      deliveryDate: [new Date(), [Validators.required]],
      driverName: [''],
      vehiclePlate: [''],
    });
  }

  private async loadDeliveryData() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.deliveryId.set(id);
      this.coreService.setPageTitle('Editar Entrega', 'Editar informações da entrega');
      
      try {
        const delivery = await this.deliveryState.getDeliveryById(id);
        this.deliveryForm.patchValue({
          name: delivery.name,
          description: delivery.description || '',
          deliveryDate: new Date(delivery.deliveryDate),
          driverName: delivery.driverName || '',
          vehiclePlate: delivery.vehiclePlate || '',
        });
        
        if (delivery.orderIds && delivery.orderIds.length > 0) {
          const orderIds = new Set(delivery.orderIds);
          this.selectedOrders.set(orderIds);
        }
      } catch (error) {
        console.error('Erro ao carregar entrega:', error);
      }
    } else {
      this.coreService.setPageTitle('Nova Entrega', 'Criar uma nova entrega agrupando pedidos');
    }
  }

  private loadAvailableOrders() {
    this.orderState.getOrderList(true);
  }

  toggleOrderSelection(orderId: string | number) {
    const selected = new Set(this.selectedOrders());
    if (selected.has(orderId)) {
      selected.delete(orderId);
    } else {
      selected.add(orderId);
    }
    this.selectedOrders.set(selected);
  }

  isOrderSelected(orderId: string | number): boolean {
    return this.selectedOrders().has(orderId);
  }

  selectAllOrders() {
    const allOrderIds = new Set(this.availableOrders().map(order => order.id));
    this.selectedOrders.set(allOrderIds);
  }

  deselectAllOrders() {
    this.selectedOrders.set(new Set());
  }

  setTableConfig() {
    this.tableConfig.set({
      rowsPerPageOptions: [5, 10, 20],
      rowsPerPage: 10,
      paginator: true,
      pageLinkSize: 5,
      columns: [
        {
          field: 'id',
          caption: 'Cód. Pedido',
          sortable: true,
          width: '120px',
        },
        {
          field: 'customerName',
          caption: 'Cliente',
          sortable: true,
        },
        {
          field: 'total',
          caption: 'Valor',
          type: 'currency',
          sortable: true,
        },
        {
          field: 'createdAt',
          caption: 'Data',
          type: 'date',
          sortable: true,
        },
        {
          field: 'actions',
          caption: 'Selecionar',
          width: '100px',
          align: 'center',
          actionButtons: [
            {
              icon: 'lucideCheck',
              color: 'success',
              variant: 'text',
              tooltip: 'Selecionar Pedido',
              action: (rowData: Order) => {
                this.toggleOrderSelection(rowData.id);
              },
              show: (rowData: Signal<Order>) => {
                return !this.isOrderSelected(rowData().id);
              },
            },
            {
              icon: 'lucideX',
              color: 'danger',
              variant: 'text',
              tooltip: 'Remover Seleção',
              action: (rowData: Order) => {
                this.toggleOrderSelection(rowData.id);
              },
              show: (rowData: Signal<Order>) => {
                return this.isOrderSelected(rowData().id);
              },
            },
          ],
        },
      ],
    });
  }

  async saveDelivery() {
    if (this.deliveryForm.invalid) {
      this.deliveryForm.markAllAsTouched();
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    if (this.selectedOrders().size === 0) {
      this.toast.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione pelo menos um pedido para a entrega',
      });
      return;
    }

    const formValue = this.deliveryForm.value;
    const selectedOrderIds = Array.from(this.selectedOrders());
    
    // Buscar os pedidos completos
    const orders = this.availableOrders().filter(order => 
      selectedOrderIds.some(id => id === order.id)
    );

    const deliveryData: Partial<Delivery> = {
      name: formValue.name,
      description: formValue.description,
      deliveryDate: formValue.deliveryDate,
      driverName: formValue.driverName,
      vehiclePlate: formValue.vehiclePlate,
      orderIds: orders.map(order => order.id),
      status: DeliveryStatus.PENDING,
    };

    try {
      if (this.isEditMode() && this.deliveryId()) {
        await this.deliveryState.updateDelivery(this.deliveryId()!, deliveryData);
        this.toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Entrega atualizada com sucesso',
        });
      } else {
        await this.deliveryState.createDelivery(deliveryData);
        this.toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Entrega criada com sucesso',
        });
      }
      this.router.navigate(['dashboard', 'deliveries', 'list']);
    } catch (error) {
      console.error('Erro ao salvar entrega:', error);
      this.toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao salvar entrega',
      });
    }
  }

  cancel() {
    this.router.navigate(['dashboard', 'deliveries', 'list']);
  }
}

