# Period Component

Componente de seleção de período que retorna data inicial e final baseado no período selecionado.

## Funcionalidades

- Select configurável com períodos predefinidos
- Retorna data inicial e final do período selecionado
- Opções disponíveis:
  - Hoje
  - Ontem
  - Últimos 7 dias
  - Últimos 15 dias
  - Últimos 30 dias
  - Mês atual
  - Todos

## Uso Básico

```typescript
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
    console.log('Data inicial:', range.startDate);
    console.log('Data final:', range.endDate);
    console.log('Tipo de período:', range.periodType);
  }
}
```

## Configurando Períodos Disponíveis

```typescript
<fuse-period
  [availablePeriods]="['today', 'last7days', 'last30days', 'all']"
  (periodChange)="onPeriodChange($event)"
/>
```

## Com Valor Padrão

```typescript
<fuse-period
  [defaultValue]="'last7days'"
  (periodChange)="onPeriodChange($event)"
/>
```

## Exemplo Completo

```typescript
import { Component } from '@angular/core';
import PeriodComponent, {
  PeriodRange,
  PeriodType,
} from '@app/shared/components/period/period.component';

@Component({
  selector: 'app-report',
  imports: [PeriodComponent],
  template: `
    <div class="card">
      <h2>Relatório de Vendas</h2>

      <fuse-period
        [availablePeriods]="allowedPeriods"
        [placeholder]="'Selecione o período do relatório'"
        [defaultValue]="'last30days'"
        [disabled]="loading"
        (periodChange)="loadReport($event)"
      />

      <div *ngIf="reportData">
        <!-- Seu conteúdo aqui -->
      </div>
    </div>
  `,
})
export class ReportComponent {
  allowedPeriods: PeriodType[] = [
    'today',
    'last7days',
    'last15days',
    'last30days',
    'currentMonth',
  ];
  loading = false;
  reportData: any;

  loadReport(range: PeriodRange) {
    this.loading = true;

    console.log(
      'Carregando relatório de',
      range.startDate,
      'até',
      range.endDate
    );

    // Chame seu serviço aqui
    // this.reportService.getReport(range.startDate, range.endDate).subscribe(...)

    this.loading = false;
  }
}
```

## Inputs

| Input              | Tipo                      | Padrão                | Descrição                                |
| ------------------ | ------------------------- | --------------------- | ---------------------------------------- |
| `availablePeriods` | `PeriodType[]`            | Todos os períodos     | Array com os períodos que serão exibidos |
| `placeholder`      | `string`                  | 'Selecione o período' | Texto do placeholder                     |
| `disabled`         | `boolean`                 | `false`               | Desabilita o select                      |
| `defaultValue`     | `PeriodType \| undefined` | `undefined`           | Valor inicial selecionado                |

## Outputs

| Output         | Tipo          | Descrição                           |
| -------------- | ------------- | ----------------------------------- |
| `periodChange` | `PeriodRange` | Emitido quando o período é alterado |

## Tipos

```typescript
export type PeriodType =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last15days'
  | 'last30days'
  | 'currentMonth'
  | 'all';

export interface PeriodRange {
  startDate: Date;
  endDate: Date;
  periodType: string;
}
```

## Cálculo de Datas

- **Hoje**: Do início ao fim do dia atual
- **Ontem**: Do início ao fim do dia de ontem
- **Últimos 7 dias**: Dos últimos 6 dias até hoje (total: 7 dias)
- **Últimos 15 dias**: Dos últimos 14 dias até hoje (total: 15 dias)
- **Últimos 30 dias**: Dos últimos 29 dias até hoje (total: 30 dias)
- **Mês atual**: Do primeiro ao último dia do mês atual
- **Todos**: De 01/01/2000 até hoje
