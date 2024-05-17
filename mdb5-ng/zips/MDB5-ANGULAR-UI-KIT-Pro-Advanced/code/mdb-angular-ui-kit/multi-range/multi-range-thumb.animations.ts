import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  style,
  transition,
  trigger,
  animation,
  useAnimation,
} from '@angular/animations';

export function fadeInAnimation(): AnimationTriggerMetadata {
  return trigger('fadeIn', [
    transition(':enter', [
      useAnimation(
        animation(
          [
            animate(
              '150ms 0ms',
              keyframes([
                style({
                  opacity: 0,
                  transform: 'translateY(20px) scale(0)',
                  offset: 0,
                  easing: 'ease',
                }),
                style({
                  opacity: 1,
                  transform: 'translateY(0px) scale(1)',
                  offset: 1,
                  easing: 'ease',
                }),
              ])
            ),
          ],
          {
            delay: 0,
          }
        )
      ),
    ]),
    transition(':leave', [
      useAnimation(
        animation(
          [
            animate(
              '150ms 0ms',
              keyframes([
                style({
                  opacity: 0,
                  transform: 'translateY(0px) scale(1)',
                  offset: 0,
                  easing: 'ease',
                }),
                style({
                  opacity: 1,
                  transform: 'translateY(0px) scale(0)',
                  offset: 1,
                  easing: 'ease',
                }),
              ])
            ),
          ],
          {
            delay: 0,
          }
        )
      ),
    ]),
  ]);
}
