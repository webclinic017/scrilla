import { animate, animateChild, keyframes, style, query, state, transition, trigger } from '@angular/animations';
import { Injectable } from '@angular/core';

export interface AnimationProperties{
    duration : string, delay: string, easing: string
}

export interface AnimationControl{
    scale?: string, highlight?: string
}

const scaleState = 'scale'
const highlightState = 'highlight'

@Injectable({
    providedIn: 'root'
})
export class AnimationService{


    private static defaultAnimationProperties : AnimationProperties = {
        delay: '25ms', duration: '500ms', easing: ''
    }
    
    public static getAnimationString(properties : AnimationProperties){
        let animation_string = properties.duration;
        if(properties.delay){ animation_string = animation_string + ' ' + properties.delay}
        if(properties.easing){ animation_string = animation_string + ' ' + properties.easing}
        return animation_string;
    }

    public emitAnimation() : AnimationControl{
        return { scale: `${scaleState}`, highlight: `${highlightState}` }
    }

    public resetAnimation() : AnimationControl {
        return { scale: '', highlight: ''}
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
                                        properties : AnimationProperties = this.defaultAnimationProperties){
        return trigger('openClose', [
            state('open', style({ bottom: `${openHeight}` })),
            state('closed', style({ bottom: `${closeHeight}` })),
            transition('open <=> closed', [ animate(this.getAnimationString(properties))])
        ])
    }

    public static getScaleTrigger( scaleFactor: number,
                                        properties : AnimationProperties = this.defaultAnimationProperties){
        return trigger(`${scaleState}`, [
            state(`${scaleState}`, style({ transform: `scale(${scaleFactor})`,})),
            transition(`void <=> ${scaleState}`, [ animate(this.getAnimationString(properties))])
        ]);
    }

    public static getHighlightTrigger(cssColor: string,
                                        properties : AnimationProperties = this.defaultAnimationProperties){
        return trigger(`${highlightState}`, [
            state(`${highlightState}`, style({ backgroundColor: `${cssColor}`})),
            transition(`void <=> ${highlightState}`, [ animate(this.getAnimationString(properties))])
        ])                                   
    }
}