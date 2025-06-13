import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  animateChild,
} from '@angular/animations';

export const heightAnimation = trigger('heightAnimation', [
  state('in', style({ height: '*', opacity: 1, overflow: 'hidden' })),
  state('out', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
  transition('in <=> out', animate('300ms ease-in-out')),
]);

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),

    query(':enter', [style({ opacity: 0 })], { optional: true }),

    query(':leave', [animate('0s ease-in-out', style({ opacity: 0 }))], {
      optional: true,
    }),
    query(':leave', animateChild(), { optional: true }),

    query(':enter', [animate('0.3s ease-in-out', style({ opacity: 1 }))], {
      optional: true,
    }),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);
