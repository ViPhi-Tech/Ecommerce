import { Component, input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgxFloatUiDirective, NgxFloatUiPlacements, NgxFloatUiTriggers, NgxFloatUiContentComponent } from 'ngx-float-ui';

const MOCK_SUGGESTIONS = [
  'Produto de alta qualidade, desenvolvido com materiais selecionados. Ideal para uso diário, combina durabilidade e design. Perfeito para quem busca praticidade e bom custo-benefício.',
  'Descrição detalhada do produto: características técnicas, benefícios de uso e diferenciais. Material resistente, fácil manutenção. Recomendado por especialistas.',
  'Apresentamos um produto que une funcionalidade e estilo. Características que atendem às principais necessidades do dia a dia. Garantia de satisfação e suporte pós-venda.',
  'Item essencial para seu cotidiano. Especificações técnicas completas, benefícios comprovados e design moderno. Atende às normas de qualidade e segurança.',
];

export type PopoverPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

@Component({
  selector: 'fuse-input-with-ai',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, NgxFloatUiDirective, NgxFloatUiContentComponent],
  templateUrl: './input-ai-panel.component.html',
  styleUrls: ['./input-ai-panel.component.scss'],
})
export class InputWithAiPanelComponent {
  @ViewChild(NgxFloatUiDirective) floatUiDirective!: NgxFloatUiDirective;

  NgxFloatUiTriggers = NgxFloatUiTriggers;

  control = input.required<AbstractControl | null>();
  disabled = input<boolean>(false);

  /** Posição do popover em relação ao ícone: bottom-right (padrão), bottom-left, top-right, top-left */
  popoverPosition = input<PopoverPosition>('bottom-right');

  showIcon = false;
  generatedText: string | null = null;
  isGenerating = false;

  onWrapperMouseEnter() {
    this.showIcon = true;
  }

  onWrapperMouseLeave() {
    this.showIcon = false;
  }

  onIconClick() {
    // O toggle é gerenciado pela diretiva floatUi
  }

  getFloatUiPlacement(): NgxFloatUiPlacements {
    const position = this.popoverPosition();
    const placementMap: Record<PopoverPosition, NgxFloatUiPlacements> = {
      'bottom-right': NgxFloatUiPlacements.BOTTOMEND,
      'bottom-left': NgxFloatUiPlacements.BOTTOMSTART,
      'top-right': NgxFloatUiPlacements.TOPEND,
      'top-left': NgxFloatUiPlacements.TOPSTART,
    };
    return placementMap[position] || NgxFloatUiPlacements.BOTTOMEND;
  }

  onPopoverHide() {
    this.generatedText = null;
  }

  generateWithAi() {
    this.isGenerating = true;
    setTimeout(() => {
      const index = Math.floor(Math.random() * MOCK_SUGGESTIONS.length);
      this.generatedText = MOCK_SUGGESTIONS[index];
      this.isGenerating = false;
    }, 600);
  }

  generateAgain() {
    this.generatedText = null;
    this.generateWithAi();
  }

  accept() {
    const ctrl = this.control();
    if (ctrl && this.generatedText != null) {
      ctrl.setValue(this.generatedText);
      ctrl.markAsDirty();
    }
    this.generatedText = null;
    this.floatUiDirective?.hide();
  }
}
