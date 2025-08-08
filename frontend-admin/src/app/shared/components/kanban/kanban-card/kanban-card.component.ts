import { Component, input, output, computed } from '@angular/core';
import { NgFor, NgIf, NgClass, NgStyle } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { KanbanCard } from '../kanban.component';

@Component({
  selector: 'fuse-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  imports: [NgFor, NgIf, NgClass, NgIcon, NgStyle],
})
export class KanbanCardComponent {
  // Inputs
  card = input.required<KanbanCard>();
  height = input<number>(120);
  allowDrag = input<boolean>(true);

  // Outputs
  cardClick = output<KanbanCard>();

  // Computed
  cardStyle = computed(() => ({
    'min-height': `${this.height()}px`
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
        return 'lucideAlertTriangle';
      case 'medium':
        return 'lucideClock';
      case 'low':
        return 'lucideChevronDown';
      default:
        return 'lucideMinus';
    }
  });

  onClick() {
    this.cardClick.emit(this.card());
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
    
    const dueDate = cardDueDate instanceof Date 
      ? cardDueDate 
      : new Date(cardDueDate);
    
    return dueDate < new Date();
  }
}
