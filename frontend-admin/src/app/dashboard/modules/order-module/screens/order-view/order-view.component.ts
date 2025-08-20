import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../order.service';
import { OrderState } from '../../order.state';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';

@Component({
  selector: 'fuse-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    CardModule,
    TagModule,
    DividerModule,
  ],
})
export class OrderViewComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toast = inject(MessageService);
  private orderService = inject(OrderService);
  public orderState = inject(OrderState);

  @ViewChild('dialogRef') dialogRef!: Dialog;

  // signals
  visible = signal(false);
  isLoading = signal(true);
  orderData = signal<Order | null>(null);
  title = signal('Visualizar Pedido');

  destroyedRef = inject(DestroyRef);

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe(params => {
        const id = params['id'];
        if (id) {
          this.loadOrderData(id);
        } else {
          this.onCloseDialog();
        }
      });
  }

  async loadOrderData(id: number | string): Promise<void> {
    this.isLoading.set(true);

    this.orderService
      .getOrderById(id)
      .pipe(takeUntilDestroyed(this.destroyedRef))
      .subscribe({
        next: (response: ApiResponse<Order>) => {
          this.orderData.set(response.data);

          this.title.set(`Pedido #${response.data.id}`);
          this.isLoading.set(false);
          this.visible.set(true);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.toast.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar dados do pedido',
          });
          this.onCloseDialog();
          console.error('Erro ao carregar pedido:', error);
        },
      });
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'finalizado':
      case 'entregue':
        return 'success';
      case 'pending':
      case 'pendente':
      case 'processando':
        return 'warn';
      case 'cancelled':
      case 'cancelado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Finalizado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      case 'processing':
        return 'Processando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      default:
        return status || 'N/A';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return 'N/A';
    return dayjs(date).format('DD/MM/YYYY HH:mm');
  }

  formatCurrency(value: number): string {
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getPaymentTypeLabel(typeId: string): string {
    switch (typeId?.toLowerCase()) {
      case 'pix':
        return 'PIX';
      case 'credit':
        return 'Cartão de Crédito';
      case 'debit':
        return 'Cartão de Débito';
      case 'boleto':
        return 'Boleto';
      case 'money':
        return 'Dinheiro';
      default:
        return typeId || 'N/A';
    }
  }

  getPaymentStatusLabel(statusId: string): string {
    switch (statusId?.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return 'Pendente';
      case 'approved':
      case 'aprovado':
        return 'Aprovado';
      case 'cancelled':
      case 'cancelado':
        return 'Cancelado';
      case 'failed':
      case 'falhou':
        return 'Falhou';
      case 'refunded':
      case 'reembolsado':
        return 'Reembolsado';
      default:
        return statusId || 'N/A';
    }
  }

  getPaymentStatusSeverity(
    statusId: string
  ): 'success' | 'info' | 'warn' | 'danger' {
    switch (statusId?.toLowerCase()) {
      case 'approved':
      case 'aprovado':
        return 'success';
      case 'pending':
      case 'pendente':
        return 'warn';
      case 'cancelled':
      case 'cancelado':
      case 'failed':
      case 'falhou':
        return 'danger';
      default:
        return 'info';
    }
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

  onEditOrder() {
    if (this.orderData()?.id) {
      this.onCloseDialog();
      setTimeout(() => {
        this.router.navigate(['orders', this.orderData()?.id], {
          relativeTo: this.activatedRoute.root,
        });
      }, 300);
    }
  }
}
