import { Component, input, output, computed, signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { KanbanCard, CardAction } from '../kanban.component';

@Component({
  selector: 'fuse-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  imports: [NgClass, NgIcon, NgStyle, ButtonModule, PopoverModule, MenuModule],
})
export class KanbanCardComponent {
  // Inputs
  card = input.required<KanbanCard>();
  height = input<number>(120);
  allowDrag = input<boolean>(true);
  actions = input<CardAction[]>([]);

  // Outputs
  cardClick = output<KanbanCard>();

  // Signals
  isHovered = signal(true);

  // Computed
  cardStyle = computed(() => ({
    'min-height': `${this.height()}px`,
  }));

  priorityColor = computed(() => {
    const priority = this.card().priority;
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  });

  priorityIcon = computed(() => {
    const priority = this.card().priority;
    switch (priority) {
      case 'high':
        return 'lucideArrowUp';
      case 'medium':
        return 'lucideMinus';
      case 'low':
        return 'lucideArrowDown';
      default:
        return 'lucideArrowDown';
    }
  });

  onClick() {
    this.cardClick.emit(this.card());
  }

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }

  onActionClick(action: CardAction, event: Event) {
    event.stopPropagation(); // Evita que o clique no botão dispare o click do card
    action.action(this.card());
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffTime = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays > 0) return `Em ${diffDays} dias`;
    return `${Math.abs(diffDays)} dias atrás`;
  }

  isOverdue(): boolean {
    const cardDueDate = this.card().dueDate;
    if (!cardDueDate) return false;

    const dueDate =
      cardDueDate instanceof Date ? cardDueDate : new Date(cardDueDate);

    return dueDate < new Date();
  }
}
