import { Component, input } from '@angular/core';

interface SkeletonColumn {
  id: string;
  title: string;
  cards: { id: string }[];
}

@Component({
  selector: 'fuse-kanban-skeleton',
  templateUrl: './kanban-skeleton.component.html',
  styleUrls: ['./kanban-skeleton.component.scss'],
  standalone: true,
})
export class KanbanSkeletonComponent {
  // Input para personalizar o número de colunas
  columnsCount = input<number>(4);

  // Input para personalizar o número de cards por coluna
  cardsPerColumn = input<number[]>([3, 4, 2, 5]);

  // Getter que gera as colunas skeleton dinamicamente
  get skeletonColumns(): SkeletonColumn[] {
    const count = this.columnsCount();
    const cardsConfig = this.cardsPerColumn();

    return Array(count)
      .fill(null)
      .map((_, index) => ({
        id: `skeleton-${index + 1}`,
        title: 'Loading...',
        cards: Array(cardsConfig[index] || 3)
          .fill(null)
          .map((_, cardIndex) => ({
            id: `skeleton-card-${index}-${cardIndex}`,
          })),
      }));
  }
}
