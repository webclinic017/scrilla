import { Component, OnInit } from '@angular/core';
import { AnimationProperties, AnimationControl, AnimationService } from '../../services/animations.service';

const scaleAnimationProperties : AnimationProperties = {
  delay: '',
  duration: '250ms',
  easing: ''
}

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.5, scaleAnimationProperties),
      // TODO: figure some way to pull hex color from theme palette instead of manually
      // passing it in the animation...
    AnimationService.getHighlightTrigger('#81C784')
  ]
})
export class SplashComponent implements OnInit {

  public registerBtnAnimationControl: AnimationControl = this.animator.resetAnimation();
  public tryBtnAnimationControl : AnimationControl =  this.animator.resetAnimation();
  public rightNavAnimationControl: AnimationControl = this.animator.resetAnimation();
  public leftNavAnimationControl : AnimationControl = this.animator.resetAnimation();

  constructor(public animator : AnimationService) { }

  ngOnInit(): void {}
  
}
