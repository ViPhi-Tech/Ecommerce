import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import * as lucideIcons from '@ng-icons/lucide';
import {
  matArrowDropDownOutline,
  matKeyboardArrowDownOutline,
} from '@ng-icons/material-icons/outline';
import { heroPencilSquare } from '@ng-icons/heroicons/outline';
import { NgxEchartsModule } from 'ngx-echarts';

import { providePrimeNG } from 'primeng/config';
import { routes } from './app/app.routes';
import { CoreInterceptor } from './app/shared/interceptors/core.interceptor';
import { Preset } from './prime.theme';
import { MessageService } from 'primeng/api';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';
import { NgxFloatUiModule, NgxFloatUiTriggers, NgxFloatUiPlacements } from 'ngx-float-ui';

registerLocaleData(localePt, 'pt-BR');

export const THEME: ApplicationConfig = {
  providers: [
    MessageService,
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([CoreInterceptor])),
    importProvidersFrom(
      NgIconsModule.withIcons(lucideIcons),
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
      NgxFloatUiModule.forRoot({
        trigger: NgxFloatUiTriggers.hover,
        hideOnClickOutside: false,
        appendTo: 'body',
        placement: NgxFloatUiPlacements.AUTO
      })
    ),
    provideEnvironmentNgxMask(),
    provideIcons({
      matArrowDropDownOutline,
      matKeyboardArrowDownOutline,
      heroPencilSquare,
    }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    providePrimeNG({
      theme: {
        preset: Preset,
        options: {
          colorScheme: 'dark',
          theme: 'dark',
          darkModeSelector: '.dark',
        },
      },
      translation: {
        accept: 'Aceitar',
        cancel: 'Cancelar',
        reject: 'Rejeitar',
        monthNames: [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ],
        dayNames: [
          'Domingo',
          'Segunda-feira',
          'Terça-feira',
          'Quarta-feira',
          'Quinta-feira',
          'Sexta-feira',
          'Sábado',
        ],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        today: 'Hoje',
        clear: 'Limpar',
        weekHeader: 'Sem',
        firstDayOfWeek: 0,
        dateFormat: 'dd/mm/yy',
        weak: 'Fraco',
        medium: 'Médio',
        strong: 'Forte',
        passwordPrompt: 'Digite uma senha',
        emptyMessage: 'Nenhum resultado encontrado',
        emptyFilterMessage: 'Nenhum resultado encontrado',
        searchMessage: '{0} resultados disponíveis',
        selectionMessage: '{0} itens selecionados',
        emptySelectionMessage: 'Nenhum item selecionado',
        addRule: 'Adicionar regra',
        removeRule: 'Remover regra',
        upload: 'Enviar',
        choose: 'Escolher',
        pending: 'Pendente',
        noFilter: 'Sem filtro',
        apply: 'Aplicar',
        matchAll: 'Combinar todos',
        matchAny: 'Combinar qualquer',
        prevMonth: 'Mês anterior',
        nextMonth: 'Próximo mês',
        prevYear: 'Ano anterior',
        nextYear: 'Próximo ano',
        monthNamesShort: [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ],
        aria: {
          trueLabel: 'Verdadeiro',
          falseLabel: 'Falso',
          nullLabel: 'Não selecionado',
          star: '1 estrela',
          stars: '{star} estrelas',
          selectAll: 'Selecionar todos',
          unselectAll: 'Desmarcar todos',
          close: 'Fechar',
          previous: 'Anterior',
          next: 'Próximo',
          navigation: 'Navegação',
          scrollTop: 'Rolar para o topo',
          moveTop: 'Mover para o topo',
          moveUp: 'Mover para cima',
          moveDown: 'Mover para baixo',
          moveBottom: 'Mover para o final',
          moveToTarget: 'Mover para o destino',
          moveToSource: 'Mover para a origem',
          moveAllToTarget: 'Mover todos para o destino',
          moveAllToSource: 'Mover todos para a origem',
          pageLabel: 'Página {page}',
          firstPageLabel: 'Primeira página',
          lastPageLabel: 'Última página',
          nextPageLabel: 'Próxima página',
          previousPageLabel: 'Página anterior',
          rowsPerPageLabel: 'Linhas por página',
          jumpToPageDropdownLabel: 'Ir para o menu suspenso de página',
          jumpToPageInputLabel: 'Ir para o campo de entrada de página',
          selectRow: 'Selecionar linha',
          unselectRow: 'Desmarcar linha',
          expandRow: 'Expandir linha',
          collapseRow: 'Recolher linha',
          showFilterMenu: 'Mostrar menu de filtro',
          hideFilterMenu: 'Ocultar menu de filtro',
          filterOperator: 'Operador de filtro',
          filterConstraint: 'Restrição de filtro',
          editRow: 'Editar linha',
          saveEdit: 'Salvar edição',
          cancelEdit: 'Cancelar edição',
          listView: 'Visualização em lista',
          gridView: 'Visualização em grade',
          slide: 'Slide',
          slideNumber: '{slideNumber}',
          zoomImage: 'Ampliar imagem',
          zoomIn: 'Aproximar',
          zoomOut: 'Afastar',
          rotateRight: 'Girar à direita',
          rotateLeft: 'Girar à esquerda',
        },
      },
    }),
  ],
};
