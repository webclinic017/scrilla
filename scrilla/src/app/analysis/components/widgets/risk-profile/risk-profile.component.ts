import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Holding } from 'src/app/models/holding';
import { AnimationControl, animationControls, AnimationProperties, AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { Widget } from '../../widget';


@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getFoldTrigger(Widget.foldAnimationProperties),
    AnimationService.getScaleTrigger(Widget.scaleFactor),
    AnimationService.getToHeightTrigger(Widget.toHeightAnimationProperties),
  ]
})
export class RiskProfileComponent extends Widget implements OnInit {

  public holdings ?: Holding[];

  public loading : boolean = false;
  
  public calcBtnAnimationControl : AnimationControl = this.animator.initAnimation();
  public clearBtnAnimationControl : AnimationControl = this.animator.initAnimation();

  constructor(public animator : AnimationService, public api: ApiService, 
              public formBuilder : FormBuilder,) {
    super(animator, api, formBuilder); 
    this.optionalArguments = this.formBuilder.group({
      date: this.formBuilder.group({ enabled: false })
    })
  }

  ngOnInit(): void { }

  public calculate() : void {
    let params : QueryParams = {
      tickers: this.tickers,
      start: this.dates ? this.dates[0] : undefined,
      end: this.dates ? this.dates[1] : undefined,
    }
    this.loading = true;
    this.api.profile(params).subscribe( (data)=>{
      this.holdings = data;
      this.optionalArguments.disable();
      this.loading = false;
      this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.none);
      setTimeout(()=>{
        this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.full);
      }, Widget.toHeightDuration)
    })
  }

  public clear() : void {
    this.holdings = undefined; this.tickers = []; this.dates = undefined;
    this.optionalArguments.enable()
    this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.forty);
    setTimeout(()=>{
      this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.to.states.sixty)
    }, Widget.toHeightDuration)
  }

}
