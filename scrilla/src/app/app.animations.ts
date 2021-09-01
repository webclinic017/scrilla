import { animate, animateChild, keyframes, style, query, state, transition, trigger } from '@angular/animations';

export interface animationProperties{
    duration : string, delay: string, easing: string
}

export const defaultAnimationProperties : animationProperties = {
    delay: '25ms', duration: '500ms', easing: ''
}

export class animations{


    public static formatHeightStyle(height: number){
        return style({ height: `${height}%`})
    }
    public static getAnimationString(duration : string, delay: string, easing: string){
        let animation_string = duration;
        if(delay){ animation_string = animation_string + ' ' + delay}
        if(easing){ animation_string = animation_string + ' ' + easing}
        return animation_string;
    }

    /**
     * 
     * @param openHeight the opened height of a component as a percentage
     * @param closeHeight the closed height of a component as a percentage
     * @param properties animation properties. default properties are exported from this file
     *      as defaultAnimationProperties
     * @returns 
     */
    public static getOpenCloseTrigger(openHeight: number, closeHeight: number,
                                        properties : animationProperties = defaultAnimationProperties){

        return trigger('openClose', [
            state('open', style({ height: `${openHeight}%` })),
            state('closed', style({ height: `${closeHeight}%` })),
            transition('open => closed', [
                animate(this.getAnimationString(properties.duration, properties.delay, properties.easing))
            ]),
            transition('closed => open', [
                animate(this.getAnimationString(properties.duration, properties.delay, properties.easing))
            ])
        ])
    }
}