import { animate, animateChild, keyframes, style, query, state, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';
import { Injectable } from '@angular/core';

export interface AnimationProperties{
    duration : string, delay: string, easing: string
}

export interface AnimationControl{
    scale?: string, highlight?: string, opacity?: string,
    translateOff?: string, translateOn?: string, flash?:string,
    toHeight?: string, toWidth?: string, toDimensions?:string,
}

export const defaultDuration = 500

export const defaultAnimationProperties : AnimationProperties = {
    delay: '25ms', duration: `${defaultDuration}ms`, easing: ''
}

export const animationControls = {
    // STATE ANIMATIONS
    scale:{
        trigger: 'scale',
        states: {
            scale: 'scale'
        }
    },
    highlight:{
        trigger: 'highlight',
        states: {
            highlight: 'highlight'
        }
    },
    flash: {
        trigger: 'flash',
        states: {
            flash: 'flash'
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
    to:{
        height:{
            trigger: "toHeight"
        },
        width:{
            trigger: "toWidth"
        },
        dimensions: {
            trigger: "toDimensions"
        },
        states: {
            none: 'none',
            quarter: 'quarter',
            thirtyfive: 'thirtyfive',
            forty: 'forty',
            half: 'half',
            sixty: 'sixty',
            seventyfive: 'seventyfive',
            full: 'full',
            double: 'double'
        }
    },  
    // COMPONENT LIFE CYCLE ANIMATIONS
    fold:{
        trigger: 'fold'
    },
    opacity:{
        trigger: 'opacity',
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

    // SINGLE STATE ANIMATIONS
    public animateScale() : AnimationControl{ return { scale: `${animationControls.scale.states.scale}`} }

    public animateHighlight() : AnimationControl { return { highlight: `${animationControls.highlight.states.highlight}` }}

    public animateFlash(): AnimationControl { return { flash: `${animationControls.flash.states.flash}` } }

    // MULTI-STATE ANIMATIONS
    public animateTranslateOff(state : string) : AnimationControl { return { translateOff: `${state}` } }

    public animateTranslateOn(state: string) : AnimationControl { return { translateOn: `${state}` } }

    public animateToHeight(state: string) : AnimationControl { return { toHeight: `${state}` } }

    public animateToWidth(state: string) : AnimationControl { return { toWidth: `${state}` } }

    public animateToDimensions(state: string) : AnimationControl { return { toDimensions: `${state}` } }

    // ANIMATION CONTROL INITIALIZER
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

    public static getFlashTrigger(flashOnCssColor: string, flashOffCssColor: string,
                                    properties : AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.flash.trigger}`, [
            transition(`* => ${animationControls.flash.states.flash}`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ backgroundColor: `${flashOnCssColor}`, offset: 0.2 }),
                    style({ backgroundColor: `${flashOffCssColor}`, offset: 0.4 }),
                    style({ backgroundColor: `${flashOnCssColor}`, offset: 0.6 }),
                    style({ backgroundColor: `${flashOffCssColor}`, offset: 0.8 }),
                    style({ backgroundColor: `${flashOnCssColor}`, offset: 1 })
                ]))
            ])
        ])
    }

    public static getTranslateOffTrigger(distance: string, 
                                            properties: AnimationProperties = defaultAnimationProperties) 
    : AnimationTriggerMetadata {
        return trigger(`${animationControls.translate.triggers.off}`, [
            transition(`*=> ${animationControls.translate.states.left}`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: 'translateX(0)', opacity: '1', offset: 0}),
                    style({ transform: `translateX(-${distance})`, opacity: '0', offset: 0.99 }),
                    style({ transform: 'translateX(0)', opacity: '0', offset: 1})
                ]))
            ]),
            transition(`*=> ${animationControls.translate.states.right}`, [
                animate(this.getAnimationString(properties), keyframes([
                    style({ transform: 'translateX(0)', opacity: '1', offset: 0}),
                    style({ transform: `translateX(${distance})`, opacity: '0', offset: 0.99 }),
                    style({ transform: 'translateX(0)', opacity: '0', offset: 1})
                ]))
            ])
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

    public static getToDimensionsTrigger(properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.to.dimensions.trigger}`,[
            state(`${animationControls.to.states.none}`, style({ height: "0%", width: "0%", opacity: 0})),
            state(`${animationControls.to.states.quarter}`, style({ height: "25%", width: "25%", opacity: 1})),
            state(`${animationControls.to.states.thirtyfive}`, style({ height: "35%", width: "35%", opacity: 1})),
            state(`${animationControls.to.states.forty}`, style({ height: "40%", width: "40%", opacity: 1})),
            state(`${animationControls.to.states.half}`, style({ height: "50%", width: "50%", opacity: 1})),
            state(`${animationControls.to.states.sixty}`, style({ height: "60%", width: "60%", opacity: 1})),
            state(`${animationControls.to.states.seventyfive}`, style({ height: "75%", width: "75%", opacity: 1})),
            state(`${animationControls.to.states.full}`, style({ height: "100%", width: "100%", opacity: 1})),
            state(`${animationControls.to.states.double}`, style({ height: "200%", width: "200%", opacity: 1})),
            transition(`*=>*`, [ 
                animate(this.getAnimationString(properties)),
            ])
        ])
    }

    public static getToHeightTrigger(properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.to.height.trigger}`,[
            state(`${animationControls.to.states.none}`, style({ height: "0%", opacity: 0})),
            state(`${animationControls.to.states.quarter}`, style({ height: "25%", opacity: 1})),
            state(`${animationControls.to.states.thirtyfive}`, style({ height: "35%", opacity: 1})),
            state(`${animationControls.to.states.forty}`, style({ height: "40%", opacity: 1})),
            state(`${animationControls.to.states.half}`, style({ height: "50%", opacity: 1})),
            state(`${animationControls.to.states.sixty}`, style({ height: "60%", opacity: 1})),
            state(`${animationControls.to.states.seventyfive}`, style({ height: "75%", opacity: 1})),
            state(`${animationControls.to.states.full}`, style({ height: "100%", opacity: 1})),
            state(`${animationControls.to.states.double}`, style({ height: "200%", opacity: 1})),
            transition(`*=>*`, [ 
                animate(this.getAnimationString(properties)),
            ])
        ])
    }

    public static getToWidthTrigger(properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata{
        return trigger(`${animationControls.to.width.trigger}`,[
            state(`${animationControls.to.states.none}`, style({ width: "0%", opacity: 0})),
            state(`${animationControls.to.states.quarter}`, style({ width: "25%", opacity: 1})),
            state(`${animationControls.to.states.thirtyfive}`, style({ width: "35%", opacity: 1})),
            state(`${animationControls.to.states.forty}`, style({ width: "40%", opacity: 1})),
            state(`${animationControls.to.states.half}`, style({ width: "50%", opacity: 1})),
            state(`${animationControls.to.states.sixty}`, style({ width: "60%", opacity: 1})),
            state(`${animationControls.to.states.seventyfive}`, style({ width: "75%", opacity: 1})),
            state(`${animationControls.to.states.full}`, style({ width: "100%", opacity: 1})),
            state(`${animationControls.to.states.double}`, style({ width: "200%", opacity: 1})),
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

    public static getOpacityTrigger(properties: AnimationProperties = defaultAnimationProperties)
    : AnimationTriggerMetadata {
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