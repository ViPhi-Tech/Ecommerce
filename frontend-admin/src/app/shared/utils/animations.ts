import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const heightAnimation = trigger('heightAnimation', [
  state('in', style({ height: '*', opacity: 1, overflow: 'hidden' })),
  state('out', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
  transition('in <=> out', animate('300ms ease-in-out')),
]);
