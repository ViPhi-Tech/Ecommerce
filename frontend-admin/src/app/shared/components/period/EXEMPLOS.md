# Exemplos de Uso do Componente Period

## Exemplo 1: Uso Básico

```typescript
// No componente TypeScript
import PeriodComponent, {
  PeriodRange,
} from '@app/shared/components/period/period.component';

@Component({
  selector: 'app-example',
  imports: [PeriodComponent],
  template: ` <fuse-period (periodChange)="onPeriodChange($event)" /> `,
})
export class ExampleComponent {
  onPeriodChange(range: PeriodRange) {
    console.log('Período:', range);
    // range.startDate - Data inicial
    // range.endDate - Data final
    // range.periodType - Tipo do período ('today', 'last7days', etc)
  }
}
```

## Exemplo 2: Apenas Algumas Opções

```typescript
// Template
<fuse-period
  [availablePeriods]="['today', 'last7days', 'last30days']"
  (periodChange)="onPeriodChange($event)"
/>
```

## Exemplo 3: Com Valor Padrão

```typescript
// Template
<fuse-period
  [defaultValue]="'last15days'"
  (periodChange)="onPeriodChange($event)"
/>
```

## Exemplo 4: Personalizado

```typescript
// Template
<fuse-period
  [availablePeriods]="['last7days', 'last30days', 'currentMonth']"
  [placeholder]="'Escolha um período'"
  [defaultValue]="'last30days'"
  [disabled]="isLoading"
  (periodChange)="loadData($event)"
/>

// Componente
loadData(range: PeriodRange) {
  this.isLoading = true;
  this.apiService.getData(range.startDate, range.endDate)
    .subscribe(data => {
      this.data = data;
      this.isLoading = false;
    });
}
```

## Exemplo 5: Filtrar Tabela por Período

```typescript
@Component({
  selector: 'app-sales-report',
  imports: [PeriodComponent, TableComponent],
  template: `
    <div class="card">
      <h2>Relatório de Vendas</h2>

      <div class="mb-4">
        <label class="block mb-2">Período</label>
        <fuse-period
          [availablePeriods]="[
            'today',
            'yesterday',
            'last7days',
            'last15days',
            'last30days',
            'currentMonth',
          ]"
          [defaultValue]="'last30days'"
          (periodChange)="filterSales($event)"
        />
      </div>

      <fuse-table [data]="filteredSales" [loading]="loading" />
    </div>
  `,
})
export class SalesReportComponent {
  allSales: Sale[] = [];
  filteredSales: Sale[] = [];
  loading = false;

  filterSales(range: PeriodRange) {
    this.loading = true;

    // Filtrar vendas pelo período
    this.filteredSales = this.allSales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= range.startDate && saleDate <= range.endDate;
    });

    this.loading = false;
  }
}
```

## Exemplo 6: Integração com API

```typescript
@Component({
  selector: 'app-dashboard',
  imports: [PeriodComponent],
  template: `
    <fuse-period
      [availablePeriods]="['today', 'last7days', 'last30days', 'currentMonth']"
      [defaultValue]="'last30days'"
      (periodChange)="loadMetrics($event)"
    />

    <div class="metrics">
      <div>Total de Vendas: {{ metrics.totalSales | currency }}</div>
      <div>Total de Pedidos: {{ metrics.totalOrders }}</div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  metrics = {
    totalSales: 0,
    totalOrders: 0,
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Carrega dados iniciais com período padrão
  }

  loadMetrics(range: PeriodRange) {
    this.apiService
      .getMetrics({
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString(),
      })
      .subscribe(data => {
        this.metrics = data;
      });
  }
}
```

## Exemplo 7: Sincronizar com Store/State

```typescript
@Component({
  selector: 'app-orders',
  imports: [PeriodComponent, TableComponent],
  template: `
    <fuse-period
      [defaultValue]="'last30days'"
      (periodChange)="updatePeriod($event)"
    />

    <fuse-table [data]="state.orders()" [loading]="state.loading()" />
  `,
})
export class OrdersComponent {
  state = inject(OrdersState);

  updatePeriod(range: PeriodRange) {
    // Atualiza o state com o novo período
    this.state.setPeriod(range);
    this.state.loadOrders();
  }
}
```

## Retorno do Evento `periodChange`

O evento `periodChange` retorna um objeto `PeriodRange` com:

```typescript
{
  startDate: Date,    // Data inicial do período (início do dia)
  endDate: Date,      // Data final do período (fim do dia)
  periodType: string  // Tipo selecionado ('today', 'last7days', etc)
}
```

### Exemplos de retorno por tipo:

**today** (Hoje - 09/10/2025):

```javascript
{
  startDate: 2025-10-09T00:00:00.000Z,
  endDate: 2025-10-09T23:59:59.999Z,
  periodType: 'today'
}
```

**yesterday** (Ontem):

```javascript
{
  startDate: 2025-10-08T00:00:00.000Z,
  endDate: 2025-10-08T23:59:59.999Z,
  periodType: 'yesterday'
}
```

**last7days** (Últimos 7 dias):

```javascript
{
  startDate: 2025-10-03T00:00:00.000Z,
  endDate: 2025-10-09T23:59:59.999Z,
  periodType: 'last7days'
}
```

**last15days** (Últimos 15 dias):

```javascript
{
  startDate: 2025-09-25T00:00:00.000Z,
  endDate: 2025-10-09T23:59:59.999Z,
  periodType: 'last15days'
}
```

**last30days** (Últimos 30 dias):

```javascript
{
  startDate: 2025-09-10T00:00:00.000Z,
  endDate: 2025-10-09T23:59:59.999Z,
  periodType: 'last30days'
}
```

**currentMonth** (Mês atual - Outubro):

```javascript
{
  startDate: 2025-10-01T00:00:00.000Z,
  endDate: 2025-10-31T23:59:59.999Z,
  periodType: 'currentMonth'
}
```

**all** (Todos):

```javascript
{
  startDate: 2000-01-01T00:00:00.000Z,
  endDate: 2025-10-09T23:59:59.999Z,
  periodType: 'all'
}
```
