import { animate, animateChild, keyframes, style, query, state, transition, trigger, AnimationTriggerMetadata, AnimationMetadata } from '@angular/animations';
import { Injectable } from '@angular/core';

export interface AnimationProperties{
    duration : string, delay: string, easing: string
}

export interface AnimationControl{
    scale?: string, highlight?: string, opacity?: string,
    translateOff?: string, translateOn?: string, toHeight?: string
}

export const defaultAnimationProperties : AnimationProperties = {
    delay: '25ms', duration: '500ms', easing: ''
}

export const animationControls = {
    // STATE ANIMATIONS
    scale:{
        trigger: 'scale',
        states: {
            scale: 'scale'
        }
    },
    opacity:{
        trigger: 'opacity',
        states: {
            opaque: 'opague'
        }
    },
    highlight:{
        trigger: 'highlight',
        states: {
            highlight: 'highlight'
        }
    },
    translate:{
        triggers: {
            on: 'translateOn',
            off: 'translateOff'
        },
        states: {
            right: 'right',
            left: 'left'
        }
    },
    toHeight: {
        trigger: 'toHeight',
        states: {
            none: 'none',
            quarter: 'quarter',
            half: 'half',
            full: 'full',
            double: 'double'
        }
    },
    // COMPONENT LIFE CYCLE ANIMATIONS
    fold:{
        trigger: 'fold'
    },
}

@Injectable({
    providedIn: 'root'
})
export class AnimationService{
    /**
     * Controls are only required for animations that are triggered by user input, i.e. the cursor entering or leaving a certain position or similar action. Animations that are triggered directly by elements entering or leaving, i.e. when certain conditions are met, a div is inserted or cut from the DOM, do not require a state to manage their animation. They can be handled by the ':enter' and ':leave' transition triggers proscribed by Angular Animations. Their animations can be statically accessed and added to the animations metadata in a Component class and then the trigger bound to the corresponding element that is to be animated. For example, the 'fold' trigger can be added to the animations metadata,
     * 
     * animations [ AnimationService.getFoldTrigger()]
     * 
     * 
     * And then an element whose presence in the DOM is conditional can be animated by binding a trigger to it,
     * 
     * <div *ngIf="someCondition" [@fold]></div>
     * 
     * This will animation will cause the element to "fold" open, by using the CSS scale function. 
     * 
     * Animations that are controlled by user input require an AnimationControl. AnimationControls can be instantiated with AnimationService.initAnimation(). This returns an AnimationControl will all the animations set to disabled,
     * 
     * let myControl = animationService.initAnimation()
     * 
     * Once a control is created, the control trigger for an animation must be bound to the trigger in the DOM,
     * 
     * <div [@trigger]="myControl.trigger"></div>
     * 
     * To animation the element, use user events to make calls to the AnimationService to perform the specified animation. For example, a div binded to a 'scale' trigger can have its element animated when a mouse enters its boundaries with the following,
     * 
     * <div [@scale]="myControl.scale" (mouseenter)="myControl = animationService.animateScale()" (mouseleave)="animationSerice.initAnimation()">
     * 
     * The above element will scale up/down when a user cursor enters its boundaries and then scale back down when the user leaves.
     */

    // SERVICE INSTANCE METHODS
    public animateScale() : AnimationControl{ return { scale: `${animationControls.scale.states.scale}`} }

    public animateHighlight() : AnimationControl { return { highlight: `${animationControls.highlight.states.highlight}` }}

    public animateOpacity() : AnimationControl  { return { opacity: `${animationControls.opacity.states.opaque}`}}

    public animateTranslateOff(state : string) : AnimationControl { return { translateOff: `${state}` } }

    public animateTranslateOn(state: string) : AnimationControl { return { translateOn: `${state}` } }

    public animateToHeight(state: string) : AnimationControl { return { toHeight: `${state}`}}

    public initAnimation() : AnimationControl { return { scale: '', highlight: '', translateOff: '', translateOn: '' } }

    // STATIC FACTORY METHODS

    public static animateChildren(){ return query('@*', animateChild(), {optional: true})}

    public static getAnimationString(properties : AnimationProperties) : string{
        let animation_string = properties.duration;
        if(properties.delay){ animation_string = animation_string + ' ' + properties.delay}
        if(properties.easing){ animation_string = animation_string + ' ' + properties.easing}
        return animation_string;
    }

    public static getScaleTrigger( scaleFactor: number,
                                        properties : AnimationProperties = defaultAnimationProperties) 
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.scale.trigger}`, [
            state(`${animationControls.scale.states.scale}`, style({ transform: `scale(${scaleFactor})`,})),
            transition(`void <=> ${animationControls.scale.states.scale}`, [ animate(this.getAnimationString(properties))])
        ]);
    }

    public static getHighlightTrigger(cssColor: string,
                                        properties : AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
    
        return trigger(`${animationControls.highlight.trigger}`, [
            state(`${animationControls.highlight.states.highlight}`, style({ backgroundColor: `${cssColor}`})),
            transition(`void <=> ${animationControls.highlight.states.highlight}`, [ animate(this.getAnimationString(properties))])
        ])                                   
    }

    public static getTranslateOffTrigger(distance: string, 
                                            properties: AnimationProperties = defaultAnimationProperties) 
    : AnimationTriggerMetadata {
        return trigger(`${animationControls.translate.triggers.off}`, [
            state(`${animationControls.translate.states.left}`, style({ transform: `translateX(-${distance})`, opacity: '0'})),
            state(`${animationControls.translate.states.right}`, style({ transform: `translateX(${distance})`, opacity: '0'})),
            transition('* => *', animate(this.getAnimationString(properties)))
        ])
    }

    public static getTranslateOnTrigger(distance: string,
                                            properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.translate.triggers.on}`, [
            transition(`* => ${animationControls.translate.states.left}`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: `translateX(-${distance})`, opacity: '0', offset: 0}),
                    style({ transform: 'translateX(0)', opacity: '1', offset: 1})
                ]))
            ]),
            transition(`* => ${animationControls.translate.states.right}`,[
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: `translateX(${distance})`, opacity: '0', offset: 0}),
                    style({ transform: 'translateX(0)', opacity: '1', offset: 1})
                ]))
            ])
        ])
    }

    public static getToHeightTrigger(properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.toHeight.trigger}`,[
            state(`${animationControls.toHeight.states.none}`, style({ height: "0%", opacity: 0})),
            state(`${animationControls.toHeight.states.quarter}`, style({ height: "25%", opacity: 1})),
            state(`${animationControls.toHeight.states.half}`, style({ height: "50%", opacity: 1})),
            state(`${animationControls.toHeight.states.full}`, style({ height: "100%", opacity: 1})),
            state(`${animationControls.toHeight.states.double}`, style({ height: "200%", opacity: 1})),
            transition(`*=>*`, [ 
                animate(this.getAnimationString(properties)),
            ])
        ])
    }

    public static getFoldTrigger(properties : AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata {
        return trigger(`${animationControls.fold.trigger}`,[
            transition(':enter', [
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: 'scale(0,0)', offset: 0}),
                    style({ transform: 'scale(1, 1)', offset: 1})
                ])),
                this.animateChildren()
            ]),
            transition(`:leave`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: 'scale(1, 1)', offset: 0}),
                    style({ transform: 'scale(0, 0)', offset: 1}),
                ])),
            ])
        ])
    }

    public static getOpacityTrigger(properties: AnimationProperties = defaultAnimationProperties){
        return trigger(`${animationControls.opacity.trigger}`,[
            transition(':enter', [
                animate(this.getAnimationString(properties), keyframes([
                    style({ opacity: 0, offset: 0}),
                    style({ opacity: 1, offset: 1})
                ])),
                this.animateChildren()
            ]),
            transition(`:leave`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ opacity: 1, offset: 0}),
                    style({ opacity: 0, offset: 1}),
                ])),
            ])
        ])
    }
}