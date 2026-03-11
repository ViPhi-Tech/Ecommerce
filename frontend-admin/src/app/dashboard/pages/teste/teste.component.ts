import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataTableComponent } from 'app/shared/components/data-table/data-table.component';
import { TableColumn } from 'app/shared/components/data-table/interfaces/data-table.interfaces';
import { TimeSlotPickerComponent } from 'app/shared/components/time-slot-picker/time-slot-picker.component';
import { FuseDatePickerComponent } from 'app/shared/components/date-picker/date-picker.component';

@Component({
  selector: 'fuse-teste',
  standalone: true,
  imports: [DatePipe, TimeSlotPickerComponent, FuseDatePickerComponent, DataTableComponent],
  templateUrl: './teste.component.html',
  styleUrl: './teste.component.scss',
})
export class TesteComponent {
  selected = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);

  // Exemplo de colunas baseado na tela de product-list
  readonly productColumns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Nome', sortable: true },
    { key: 'initialPrice', label: 'Preço de Custo', sortable: true, type: 'currency' },
    { key: 'finalPrice', label: 'Preço de Venda', sortable: true, type: 'currency' },
    {
      key: 'actions',
      label: 'Ações',
      type: 'actions',
      align: 'right',
      actions: [
        {
          label: 'Editar',
          icon: 'lucideSquarePen',
          class: 'text-primary hover:text-primary/80',
          onClick: (row) => this.onEdit(row),
        },
        {
          label: 'Excluir',
          icon: 'lucideTrash2',
          class: 'text-red-500 hover:text-red-600',
          onClick: (row) => this.onDelete(row),
        },
      ],
    },
  ];

  // Exemplo de dados mockados
  readonly productRows = [
    { id: 1, name: 'Produto A', initialPrice: 10.9, finalPrice: 19.9 },
    { id: 2, name: 'Produto B', initialPrice: 15.5, finalPrice: 29.9 },
    { id: 3, name: 'Produto C', initialPrice: 8.0, finalPrice: 14.9 },
    { id: 4, name: 'Produto D', initialPrice: 22.0, finalPrice: 39.9 },
  ];

  onTimeSelected(v: string) {
    this.selected.set(v ?? null);
  }

  onDateSelected(date: Date) {
    this.selectedDate.set(date);
  }

  onEdit(row: unknown) {
    // Exemplo simples: apenas logar o item selecionado
    // Em telas reais, aqui você navegaria para o drawer de edição
    console.log('Editar produto (teste data-table):', row);
  }

  onDelete(row: unknown) {
    console.log('Excluir produto (teste data-table):', row);
  }
}
