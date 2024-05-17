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

const fadeInDownOptions: MdbAnimationOptions = {
  trigger: 'fadeInDown',
  delay: 0,
  duration: 500,
};

const fadeInDownEnterOptions: MdbAnimationOptions = {
  trigger: 'fadeInDownEnter',
  delay: 0,
  duration: 500,
};

const fadeInDown = (options: MdbAnimationOptions): AnimationReferenceMetadata => {
  const params = {
    delay: options.delay,
    duration: options.duration,
  };

  return animation(
    [
      animate(
        '{{duration}}ms {{delay}}ms',
        keyframes([
          style({ opacity: 0, transform: 'translate3d(0, -100%, 0)', easing: 'ease', offset: 0 }),
          style({ opacity: 1, transform: 'translate3d(0, 0, 0)', easing: 'ease', offset: 1 }),
        ])
      ),
    ],
    { params }
  );
};

export function fadeInDownAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInDownOptions);

  return trigger(options.trigger, [transition('0 => 1', [useAnimation(fadeInDown(options))])]);
}

export function fadeInDownEnterAnimation(options?: MdbAnimationOptions): AnimationTriggerMetadata {
  options = getOptions(options, fadeInDownEnterOptions);

  return trigger(options.trigger, [transition(':enter', [useAnimation(fadeInDown(options))])]);
}
