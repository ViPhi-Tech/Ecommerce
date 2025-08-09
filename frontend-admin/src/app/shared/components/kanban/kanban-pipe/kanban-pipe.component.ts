import { Component, input, output, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { KanbanCard, KanbanColumn } from '../kanban.component';
import { KanbanCardComponent } from '../kanban-card/kanban-card.component';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'fuse-kanban-pipe',
  templateUrl: './kanban-pipe.component.html',
  styleUrls: ['./kanban-pipe.component.scss'],
  imports: [NgClass, NgIcon, KanbanCardComponent, CdkDropList, CdkDrag],
})
export class KanbanPipeComponent {
  // Inputs
  column = input.required<KanbanColumn>();
  cardHeight = input<number>(120);
  allowDragDrop = input<boolean>(false);

  // Outputs
  cardClick = output<KanbanCard>();
  cardDrop = output<CdkDragDrop<KanbanCard[]>>();

  // Signals
  isCollapsed = signal<boolean>(false);

  // Computed
  cardCount = computed(() => this.column().cards.length);
  hasMaxCards = computed(() => {
    const col = this.column();
    return col.maxCards ? col.cards.length >= col.maxCards : false;
  });

  columnColorClass = computed(() => {
    const color = this.column().color;
    if (!color) return 'border-gray-300 dark:border-gray-600';

    // Mapear cores para classes CSS
    const colorMap: Record<string, string> = {
      blue: 'border-blue-300 dark:border-blue-600',
      green: 'border-green-300 dark:border-green-600',
      yellow: 'border-yellow-300 dark:border-yellow-600',
      red: 'border-red-300 dark:border-red-600',
      purple: 'border-purple-300 dark:border-purple-600',
      pink: 'border-pink-300 dark:border-pink-600',
      indigo: 'border-indigo-300 dark:border-indigo-600',
    };

    return colorMap[color] || 'border-gray-300 dark:border-gray-600';
  });

  headerColorClass = computed(() => {
    const color = this.column().color;
    if (!color) return 'bg-gray-100 dark:bg-gray-800';

    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/20',
      green: 'bg-green-100 dark:bg-green-900/20',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20',
      red: 'bg-red-100 dark:bg-red-900/20',
      purple: 'bg-purple-100 dark:bg-purple-900/20',
      pink: 'bg-pink-100 dark:bg-pink-900/20',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/20',
    };

    return colorMap[color] || 'bg-gray-50 dark:bg-gray-800';
  });

  onCardClick(card: KanbanCard) {
    this.cardClick.emit(card);
  }

  onCardDrop(event: CdkDragDrop<KanbanCard[]>) {
    this.cardDrop.emit(event);
  }

  toggleCollapse() {
    this.isCollapsed.update(collapsed => !collapsed);
  }
}
