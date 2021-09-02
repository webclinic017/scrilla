import { Component, OnInit } from '@angular/core';
import { animations, animationProperties } from '../../app.animations';

const scaleAnimationProperties : animationProperties = {
  delay: '',
  duration: '250ms',
  easing: ''
}

// TODO: figure some way to pull hex color from theme palette instead of manually
// passing it in the animation...

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
  animations: [
    animations.getScaleTrigger(1.5, scaleAnimationProperties),
    animations.getHighlightTrigger('#81C784')
  ]
})
export class SplashComponent implements OnInit {

  // animation controls. values: 'normal', 'enlarge'. See src/app/app.animations for more info.
  public registerBtnAnimationControl: any = {
    scale: '', highlight: ''
  };
  public tryBtnAnimationControl : any = {
    scale: '', hightlight: ''
  };

  constructor() { }

  ngOnInit(): void {}
  
  public animateRegisterBtn(){
    this.registerBtnAnimationControl = {
      scale: 'scale', highlight: 'highlight'
    }
  }
  public resetRegisterBtn(){
    this.registerBtnAnimationControl = {
        scale: '', highlight: ''
    }
  }

  public animateTryBtn(){
    this.tryBtnAnimationControl = {
      scale: 'scale', highlight: 'highlight'
    }
  }

  public resetTryBtn(){
    this.tryBtnAnimationControl = {
      scale: '', highlight: ''
    }
  }

}
