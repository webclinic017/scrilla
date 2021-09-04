import { Component, OnInit } from '@angular/core';
import { AnimationService } from 'src/app/services/animations.service';

@Component({
  selector: 'app-portfolio-optimizer',
  templateUrl: './portfolio-optimizer.component.html',
  styleUrls: ['./portfolio-optimizer.component.css'],
  animations: [
    AnimationService.getScaleTrigger(1.25)
  ]
})
export class PortfolioOptimizerComponent implements OnInit {

  public optimizeBtnAnimationControl = this.animator.initAnimation()
  public clearBtnAnimationControl = this.animator.initAnimation();

  constructor(public animator : AnimationService) { }

  ngOnInit(): void {
  }

}
