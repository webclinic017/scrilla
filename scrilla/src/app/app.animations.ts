import { animate, animateChild, keyframes, style, query, state, transition, trigger } from '@angular/animations';

export class animations{
    public static defaultDelay : string = '25ms'
    public static defaultDuration : string = '500ms'
    public static noDelay : string = '';

    private static stretchKeyframes = keyframes([
        style({ height: '0%', offset: 0}),
        style({ height: '25%', offset: 0.25}),
        style({ height: '50%', offest: 0.5}),
        style({ height: '75%', offset: 0.75}),
        style({ height: '100%', offset: 1})
    ])

    public static getAnimationString(duration : string, delay: string, easing: string){
        let animation_string = duration;
        if(delay){ animation_string = animation_string + ' ' + delay}
        if(easing){ animation_string = animation_string + ' ' + easing}
        return animation_string;
    }

    public static getStretchAnimation(duration: string, delay : string, easing: string){
        return animate(this.getAnimationString(duration, delay, easing), this.stretchKeyframes)
    }

    public static getOpenCloseTrigger(duration: string = this.defaultDuration, delay: string, easing: string){
        return trigger('openClose', [
            state('open', style({ height: '100%' })),
            state('closed', style({ height: '0%' })),
            transition('open => closed', [
                animate(this.getAnimationString(duration, delay, easing))
            ]),
            transition('closed => open', [
                animate(this.getAnimationString(duration, delay, easing))
            ])
        ])
    }
}