import {
  animate,
  AnimationTriggerMetadata,
  keyframes,
  style,
  transition,
  trigger,
  animation,
  useAnimation,
  AnimationReferenceMetadata,
} from '@angular/animations';
import { MdbAnimationOptions } from '../animation.options';
import { getOptions } from '../animations.utils';

const browseOutLeftOptions: MdbAnimationOptions = {
  trigger: 'browseOutLeft',
  delay: 0,
  duration: 500,
};

const browseOutLeftLeaveOptions: MdbAnimationOptions = {
  trigger: 'browseOutLeftLeave',
  delay: 0,
  duration: 500,
};

const browseOutLeft = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({
            transform: 'translateX(0%) rotateY(0deg) rotateX(0deg)',
            zIndex: 999,
            easing: 'ease',
            offset: 0,
          }),
          style({
            transform: 'translateX(-105%) rotateY(35deg) rotateX(10deg) translateZ(-10px)',
            zIndex: -1,
            easing: 'ease',
            offset: 0.5,
          }),
          style({
            opacity: 1,
            offset: 0.8,
          }),
          style({
            transform: 'translateX(0%) rotateY(0deg) rotateX(0deg) translateZ(-10px)',
            zIndex: -1,
            opacity: 0,
            easing: 'ease',
            offset: 1,
          }),
        ])
      ),
    ],
    { params }
  );
};

export function browseOutLeftAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, browseOutLeftOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(browseOutLeft(options))])]);
}

export function browseOutLeftLeaveAnimation(
  options?: MdbAnimationOptions
): AnimationTriggerMetadata {
  options = getOptions(options, browseOutLeftLeaveOptions);

  return trigger(options.trigger, [transition(':leave', [useAnimation(browseOutLeft(options))])]);
}
