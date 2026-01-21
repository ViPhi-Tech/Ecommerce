import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fuse-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() title = 'Nenhum dado encontrado';
  @Input() description = 'Não há informações disponíveis no momento.';
  @Input() icon = 'chart-bar';
  @Input() actionText = '';
  @Input() showAction = false;
}