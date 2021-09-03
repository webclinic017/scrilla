import { animate, animateChild, keyframes, style, query, state, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';
import { Injectable } from '@angular/core';

export interface AnimationProperties{
    duration : string, delay: string, easing: string
}

export interface AnimationControl{
    scale?: string, highlight?: string, 
    translateOff?: string, translateOn?: string
}

export const defaultAnimationProperties : AnimationProperties = {
    delay: '25ms', duration: '500ms', easing: ''
}

const scaleProperties = {
    trigger: 'scale',
    states: {
        scale: 'scale'
    }
};
const highlightProperties = {
    trigger: 'highlight',
    states: {
        highlight: 'highlight'
    }
};
const translateProperties = {
    triggers: {
        on: 'translateOn',
        off: 'translateOff'
    },
    states: {
        right: 'right',
        left: 'left'
    }
}

@Injectable({
    providedIn: 'root'
})
export class AnimationService{

    // SERVICE INSTANCE METHODS
    public animateScale() : AnimationControl{ return { scale: `${scaleProperties.states.scale}`} }

    public animateHighlight() : AnimationControl { return { highlight: `${highlightProperties.states.highlight}` }}

    public animateTranslateOffLeft() : AnimationControl { return { translateOff: `${translateProperties.states.left}` }}

    public animateTranslateOffRight() : AnimationControl { return { translateOff: `${translateProperties.states.right}`}}

    public animateTranslateOnLeft() : AnimationControl { return { translateOn: `${translateProperties.states.left}`}}

    public animateTranslateOnRight() : AnimationControl { return { translateOn: `${translateProperties.states.right}`}}

    public initAnimation() : AnimationControl { return { scale: '', highlight: '', translateOff: '', translateOn: ''} }

    // STATIC FACTORY METHODS
    public static getAnimationString(properties : AnimationProperties) : string{
        let animation_string = properties.duration;
        if(properties.delay){ animation_string = animation_string + ' ' + properties.delay}
        if(properties.easing){ animation_string = animation_string + ' ' + properties.easing}
        return animation_string;
    }

    public static getScaleTrigger( scaleFactor: number,
                                        properties : AnimationProperties = defaultAnimationProperties) 
    : AnimationTriggerMetadata{
        return trigger(`${scaleProperties.trigger}`, [
            state(`${scaleProperties.states.scale}`, style({ transform: `scale(${scaleFactor})`,})),
            transition(`void <=> ${scaleProperties.states.scale}`, [ animate(this.getAnimationString(properties))])
        ]);
    }

    public static getHighlightTrigger(cssColor: string,
                                        properties : AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
    
        return trigger(`${highlightProperties.trigger}`, [
            state(`${highlightProperties.states.highlight}`, style({ backgroundColor: `${cssColor}`})),
            transition(`void <=> ${highlightProperties.states.highlight}`, [ animate(this.getAnimationString(properties))])
        ])                                   
    }

    public static getTranslateOffTrigger(distance: string, 
                                            properties: AnimationProperties = defaultAnimationProperties) 
    : AnimationTriggerMetadata {
        return trigger(`${translateProperties.triggers.off}`, [
            state(`${translateProperties.states.left}`, style({ transform: `translateX(-${distance})`, opacity: '0'})),
            state(`${translateProperties.states.right}`, style({ transform: `translateX(${distance})`, opacity: '0'})),
            transition('* => *', animate(this.getAnimationString(properties)))
        ])
    }

    public static getTranslateOnTrigger(distance: string,
                                            properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${translateProperties.triggers.on}`, [
            transition(`* => ${translateProperties.states.left}`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: `translateX(-${distance})`, opacity: '0', offset: 0}),
                    style({ transform: 'translateX(0)', opacity: '1', offset: 1})
                ]))
            ]),
            transition(`* => ${translateProperties.states.right}`,[
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: `translateX(${distance})`, opacity: '0', offset: 0}),
                    style({ transform: 'translateX(0)', opacity: '1', offset: 1})
                ]))
            ])
        ])
    }
}