import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiscountDividend } from 'src/app/models/pricing';
import { AnimationControl, AnimationService } from 'src/app/services/animations.service';
import { ApiService } from 'src/app/services/api.service';
import { Widget } from '../../widget';

@Component({
  selector: 'app-price-model',
  templateUrl: './price-model.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
  ]
})
export class PriceModelComponent extends Widget implements OnInit {

  public model : DiscountDividend | undefined;

  public loading : boolean = false;

  public calcBtnAnimationControl : AnimationControl = this.animator.initAnimation();
  public clearBtnAnimationControl : AnimationControl = this.animator.initAnimation();

  constructor(public animator : AnimationService,public api: ApiService,
              public formBuilder : FormBuilder) { 
    super(animator, api, formBuilder)
  }
  
  ngOnInit(): void {}

  public calculate(): void{

  }

  public clear(): void{

  }
}
