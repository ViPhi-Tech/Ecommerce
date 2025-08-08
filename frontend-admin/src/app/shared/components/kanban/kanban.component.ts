import { Component, input, OnInit } from '@angular/core';
import { KanbanPipeComponent } from './kanban-pipe/kanban-pipe.component';

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

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  cards: KanbanCard[];
  maxCards?: number;
}

@Component({
  selector: 'fuse-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  imports: [KanbanPipeComponent],
})
export class KanbanComponent implements OnInit {
  // Inputs
  columns = input<KanbanColumn[]>([]);
  title = input<string>('Kanban Board');
  loading = input<boolean>(false);
  cardHeight = input<number>(120);
  allowDragDrop = input<boolean>(false);

  ngOnInit() {}

  onCardClick(card: KanbanCard) {
    // Emitir evento de clique no card (pode ser implementado posteriormente)
    console.log('Card clicked:', card);
  }

  getColumnCards(columnId: string): KanbanCard[] {
    return this.columns().find(col => col.id === columnId)?.cards || [];
  }
}
