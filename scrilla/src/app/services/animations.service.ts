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
const defaultAnimationProperties : AnimationProperties = {
    delay: '25ms', duration: '500ms', easing: ''
}

@Injectable({
    providedIn: 'root'
})
export class AnimationService{

    // SERVICE INSTANCE METHODS
    public animate() : AnimationControl{
        return { scale: `${scaleState}`, highlight: `${highlightState}` }
    }

    public void() : AnimationControl {
        return { scale: '', highlight: ''}
    }

    // STATIC METHODS
    public static getAnimationString(properties : AnimationProperties){
        let animation_string = properties.duration;
        if(properties.delay){ animation_string = animation_string + ' ' + properties.delay}
        if(properties.easing){ animation_string = animation_string + ' ' + properties.easing}
        return animation_string;
    }

    public static getScaleTrigger( scaleFactor: number,
                                        properties : AnimationProperties = defaultAnimationProperties){
        return trigger(`${scaleState}`, [
            state(`${scaleState}`, style({ transform: `scale(${scaleFactor})`,})),
            transition(`void <=> ${scaleState}`, [ animate(this.getAnimationString(properties))])
        ]);
    }

    public static getHighlightTrigger(cssColor: string,
                                        properties : AnimationProperties = defaultAnimationProperties){
        return trigger(`${highlightState}`, [
            state(`${highlightState}`, style({ backgroundColor: `${cssColor}`})),
            transition(`void <=> ${highlightState}`, [ animate(this.getAnimationString(properties))])
        ])                                   
    }
}