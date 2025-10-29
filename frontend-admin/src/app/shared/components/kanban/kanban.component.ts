import { Component, input, OnInit, output } from '@angular/core';
import { KanbanPipeComponent } from './kanban-pipe/kanban-pipe.component';
import { KanbanSkeletonComponent } from './kanban-skeleton/kanban-skeleton.component';
import { CdkDropListGroup, CdkDragDrop } from '@angular/cdk/drag-drop';

export interface KanbanCard {
  id: string | number;
  title: string;
  description?: string;
  status: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date | string;
  tags?: string[];
  [key: string]: any;
}

export interface CardAction {
  label: string;
  icon?: string;
  action: (card: KanbanCard) => void;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
  maxCards?: number;
  cardsActions?: CardAction[];
  filter?: {
    date: boolean
  }
}

@Component({
  selector: 'fuse-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  imports: [KanbanPipeComponent, KanbanSkeletonComponent, CdkDropListGroup],
})
export class KanbanComponent implements OnInit {
  // Inputs
  columns = input<KanbanColumn[]>([]);
  title = input<string>('Kanban Board');
  loading = input<boolean>(false);
  cardHeight = input<number>(120);
  allowDragDrop = input<boolean>(false);

  // Outputs
  cardClick = output<KanbanCard>();
  cardDrop = output<{
    event: CdkDragDrop<KanbanCard[]>;
    sourceColumn: string;
    targetColumn: string;
  }>();
  periodChange = output<unknown>()

  ngOnInit() {}

  onCardClick(card: KanbanCard) {
    this.cardClick.emit(card);
  }

  onCardDrop(event: CdkDragDrop<KanbanCard[]>) {
    const sourceColumnId = event.previousContainer.id;
    const targetColumnId = event.container.id;

    this.cardDrop.emit({
      event,
      sourceColumn: sourceColumnId,
      targetColumn: targetColumnId,
    });
  }

  getColumnCards(columnId: string): KanbanCard[] {
    return this.columns().find(col => col.id === columnId)?.cards || [];
  }


  onPeriodChange(data: unknown) {
    this.periodChange.emit(data)
  }

}
