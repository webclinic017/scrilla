import { Component, OnInit } from '@angular/core';
import { AnimationControl, AnimationProperties, AnimationService } from 'src/app/services/animations.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css'],
  animations: [
    AnimationService.getFoldTrigger(foldAnimationProperties),
    AnimationService.getScaleTrigger(1.025),
    AnimationService.getHighlightTrigger('#EF9A9A'),
    AnimationService.getFontColorTrigger('#212121')
  ]
})
export class PlanComponent implements OnInit {

  public freeStartBtnAnimationControl : AnimationControl = this.animator.initAnimation();
  public paidStartBtnAnimationControl : AnimationControl = this.animator.initAnimation();

  constructor(public animator: AnimationService) { }

  ngOnInit(): void {
  }

  public animateButton() : AnimationControl{
    return { ...this.animator.animateScale(), 
              ...this.animator.animateHighlight(), 
              ...this.animator.animateFontColor() }
  }
}
