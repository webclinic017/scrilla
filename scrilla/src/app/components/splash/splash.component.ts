
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationProperties, AnimationControl, AnimationService, animationControls } from '../../services/animations.service';

const scaleAnimationProperties : AnimationProperties = {
  delay: '', duration: '250ms', easing: ''
}
const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}
// separate duration from properties so it can be referenced by setTimeout when 
// coordinating on and off translations in the incrementPaneIndex and decrementPaneIndex
// methods. 
const translationDuration = 250
const translateAnimationProperties : AnimationProperties = {
  delay: '', duration: `${translationDuration}ms`, easing: ''
};
      // TODO: figure some way to pull hex color from theme palette instead of manually
      // passing it into the animation...
const highlightHexColor='#81C784';
const translateDistance='75%';
const scaleFactor=1.5

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [
    AnimationService.getScaleTrigger(scaleFactor, scaleAnimationProperties),
    AnimationService.getHighlightTrigger(highlightHexColor),
    AnimationService.getTranslateOffTrigger(translateDistance, translateAnimationProperties),
    AnimationService.getTranslateOnTrigger(translateDistance, translateAnimationProperties),
    AnimationService.getOpacityTrigger(),
    AnimationService.getFoldTrigger(foldAnimationProperties)
  ]
})
export class SplashComponent implements OnInit {

  public paneIndex : number = 0;

  public paneBlurbs = [
    "Professional grade financial analysis in a few clicks",
    "Well documented API for programmatic use in projects",
    "Responsive, fluid web UI for browsing experience",
    "Long term support, open-source code with GNU public license",
    "Constantly evolving CLI library with new features introduced all the time"
  ]
  public registerBtnAnimationControl: AnimationControl = this.animator.initAnimation();
  public tryBtnAnimationControl : AnimationControl =  this.animator.initAnimation();
  public rightNavAnimationControl: AnimationControl = this.animator.initAnimation();
  public leftNavAnimationControl : AnimationControl = this.animator.initAnimation();

  public paneAnimationControls : AnimationControl[]= [
    this.animator.initAnimation(), this.animator.initAnimation(), this.animator.initAnimation()
  ]

  constructor(public animator : AnimationService, private router: Router) { }

  ngOnInit(): void {}
  
  public incrementPaneIndex(){
    let previousIndex = this.paneIndex;
    let bufferIndex = this.paneIndex;
    ++bufferIndex;
    if(bufferIndex==this.paneBlurbs.length){ bufferIndex = 0 }
    this.paneAnimationControls[previousIndex] = this.animator.animateTranslateOff(animationControls.translate.states.left)
    
    setTimeout(()=>{
      this.paneIndex=bufferIndex;
      this.paneAnimationControls[this.paneIndex] = this.animator.animateTranslateOn(animationControls.translate.states.right)
    }, translationDuration)
  }

  public decrementPaneIndex(){
    let previousIndex = this.paneIndex;
    let bufferIndex = this.paneIndex
    --bufferIndex;
    if(bufferIndex==-1) { bufferIndex = this.paneBlurbs.length - 1 }
    this.paneAnimationControls[previousIndex] = this.animator.animateTranslateOff(animationControls.translate.states.right)

    setTimeout(()=>{
      this.paneIndex=bufferIndex
      this.paneAnimationControls[this.paneIndex] = this.animator.animateTranslateOn(animationControls.translate.states.left)
    }, translationDuration)
  }

  public animateButtons() : AnimationControl{
    return {...this.animator.animateScale(), ...this.animator.animateHighlight()}
  }

  public navigateToRegister() : void{ this.router.navigateByUrl('plan'); }

  public navigateToOptimize(): void { 
    this.router.navigateByUrl('analysis/optimizer/true')
  }
}
