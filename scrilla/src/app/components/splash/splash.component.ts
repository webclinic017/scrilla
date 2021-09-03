import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AnimationProperties, AnimationControl, AnimationService } from '../../services/animations.service';

const scaleAnimationProperties : AnimationProperties = {
  delay: '', duration: '250ms', easing: ''
}

const translateAnimationProperties : AnimationProperties = {
  delay: '', duration: '250ms', easing: ''
}
      // TODO: figure some way to pull hex color from theme palette instead of manually
      // passing it into the animation...
const highlightHexColor='#81C784'


@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.5, scaleAnimationProperties),
    AnimationService.getHighlightTrigger(highlightHexColor),
    AnimationService.getTranslateOffTrigger('100%', translateAnimationProperties),
    AnimationService.getTranslateOnTrigger('100%', translateAnimationProperties)
  ]
})
export class SplashComponent implements OnInit {

  public paneIndex : number = 0;
  public paneSize : number = 3;

  public registerBtnAnimationControl: AnimationControl = this.animator.initAnimation();
  public tryBtnAnimationControl : AnimationControl =  this.animator.initAnimation();
  public rightNavAnimationControl: AnimationControl = this.animator.initAnimation();
  public leftNavAnimationControl : AnimationControl = this.animator.initAnimation();

  public paneAnimationControls : AnimationControl[]= [
    this.animator.initAnimation(), this.animator.initAnimation(), this.animator.initAnimation()
  ]

  constructor(public animator : AnimationService) { }

  ngOnInit(): void {}
  
  public incrementPaneIndex(){
    let previousIndex = this.paneIndex;
    let bufferIndex = this.paneIndex
    ++bufferIndex;
    if(bufferIndex==this.paneSize){ bufferIndex = 0 }
    this.paneAnimationControls[previousIndex] = this.animator.animateTranslateOffLeft();
    let start = Date.now()
    setTimeout(()=>{
      console.log(Date.now() - start)
      this.paneIndex=bufferIndex;
      this.paneAnimationControls[this.paneIndex] = this.animator.animateTranslateOnRight();
    }, 500)
  }

  public decrementPaneIndex(){
    let previousIndex = this.paneIndex;
    --this.paneIndex;
    if(this.paneIndex==-1){ this.paneIndex = this.paneSize - 1}
    //this.paneAnimationControls[previousIndex] = this.animator.animateTranslateOffRight();
    //this.paneAnimationControls[this.paneIndex] = this.animator.animateTranslateOnLeft();
  }

  public animateButtons() : AnimationControl{
    return {...this.animator.animateScale(), ...this.animator.animateHighlight()}
  }
}
