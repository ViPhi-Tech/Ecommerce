import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { CoreService } from 'app/shared/services/core.service';
import { ButtonModule } from 'primeng/button';

export interface OrderStep {
  label: string;
  path: string; // Optional path for the step, if needed
  icon: string;
  step: number;
  perc: number;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'fuse-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
  imports: [ButtonModule, NgIcon, NgClass],
})
export class OrderHeaderComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private coreService = inject(CoreService); // Assuming CoreService is provided in the app

  today = signal(
    new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  );

  orderCode = signal('00000100');
  completePercent = signal(0);
  orderSteps = signal<OrderStep[]>([
    { label: 'Cliente', icon: 'lucideUser', perc: 0, step: 1, path: 'client' },
    { label: 'Produtos', icon: 'lucideBox', perc: 25, step: 2,  path: 'products' },
    { label: 'Entrega', icon: 'lucideTruck', perc: 50, step: 3, path: 'delivery' },
    { label: 'Pagamento', icon: 'lucideCreditCard', perc: 75, step: 4, path: 'payment' },
    { label: 'Resumo', icon: 'lucideCheck', perc: 100, step: 5, path: 'summary' },
  ]);

  constructor() {}

  ngOnInit() {
    this.coreService.setPageTitle(
      `Pedido #${this.orderCode()}`,
      `Realizado em ${this.today()}`
    );

    this.setupOrderSteps();
    this.calculateCompletePercent();
  }

  setupOrderSteps() {
    const steps = this.orderSteps().map(step => ({ ...step, active: false, completed: false, disabled: false }));
    const currentStepPath = this.router.url.split('/').pop() || '';
    const activeIndex = steps.findIndex(step => step.path === currentStepPath);

    steps.forEach((step, index) => {
      step.active = index === activeIndex;
      step.completed = index < activeIndex;
      step.disabled = index > activeIndex;
    });

    this.orderSteps.set(steps);
  }

  calculateCompletePercent() {
    const steps = this.orderSteps();
    const maxPerc = steps
      .filter(step => step.completed || step.active)
      .reduce((max, step) => step.perc > max ? step.perc : max, 0);
    this.completePercent.set(maxPerc);
  }

  goBack() {
    this.router.navigate(['/dashboard/orders/list']);
  }
}
