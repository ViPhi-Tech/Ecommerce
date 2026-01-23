import { Component, input, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { IMovimentItem } from 'app/shared/interfaces/stock/IMovimentItem';

@Component({
  selector: 'fuse-movement-item',
  templateUrl: './movement-item.component.html',
  imports: [NgIcon, CommonModule],
})
export class MovementItemComponent implements OnInit {
  item = input<IMovimentItem>();
  loading = input<boolean>();
  index = input<number>(0); // Índice do item na lista para alternar cores

  constructor() {}

  ngOnInit() {}

  /**
   * Calcula o valor total unitário (custo + ST, sem ICMS)
   */
  getTotalUnitValue(): number {
    const item = this.item();
    if (!item) return 0;
    
    const unitCost = item.unitCost || 0;
    const st = item.st || 0;
    
    return unitCost + st;
  }

  /**
   * Retorna a classe de fundo baseada no tipo de movimentação
   * Verde para entrada (IN) e vermelho para saída (OUT)
   */
  getBackgroundClass(): string {
    const item = this.item();
    if (!item) {
      return 'bg-white dark:bg-gray-900';
    }
    
    if (item.type === 'IN') {
      return 'bg-green-50 dark:bg-green-900/20'; // Verde para entrada
    } else if (item.type === 'OUT') {
      return 'bg-red-50 dark:bg-red-900/20'; // Vermelho para saída
    }
    
    return 'bg-white dark:bg-gray-900'; // Padrão para outros tipos
  }

  /**
   * Retorna o estoque anterior à movimentação (calculado no state)
   */
  getPreviousStock(): number | null {
    const item = this.item();
    return item?.previousStock ?? null;
  }

  /**
   * Retorna o estoque após esta movimentação (calculado no state)
   */
  getCurrentStock(): number | null {
    const item = this.item();
    return item?.currentStockAfterMovement ?? item?.stock?.quantity ?? null;
  }
}
