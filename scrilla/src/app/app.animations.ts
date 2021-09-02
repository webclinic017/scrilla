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
     * @param openHeight the opened height of a component.
     * @param closeHeight the closed height of a component.
     * @param properties animation properties. default properties are exported from this file
     *      as defaultAnimationProperties
     * @returns 
     */
    public static getOpenCloseTrigger(openHeight: number, closeHeight: number,
                                        properties : animationProperties = defaultAnimationProperties){

        return trigger('openClose', [
            state('open', style({ bottom: `${openHeight}` })),
            state('closed', style({ bottom: `${closeHeight}` })),
            transition('open <=> closed', [
                animate(this.getAnimationString(properties.duration, properties.delay, properties.easing))
            ])
        ])
    }

    public static getScaleTrigger( scaleFactor: number,
                                        properties : animationProperties = defaultAnimationProperties){
        return trigger('scale', [
            state('scale', style({ transform: `scale(${scaleFactor})`,})),
            transition('void <=> scale', [
                animate(this.getAnimationString(properties.duration, properties.delay, properties.easing))
            ])
        ]);
    }

    public static getHighlightTrigger(cssColor: string,
                                        properties : animationProperties = defaultAnimationProperties){
        return trigger('highlight', [
            state('none', style({})),
            state('highlight', style({ backgroundColor: `${cssColor}`}))
        ])                                   
    }
}