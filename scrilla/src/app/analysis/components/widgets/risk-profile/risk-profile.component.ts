import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Holding } from 'src/app/models/holding';
import { AnimationControl, animationControls, AnimationProperties, AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';

const foldAnimationProperties : AnimationProperties= {
  delay: '', duration: '250ms', easing: ''
}
const toHeightDuration=350
const toHeightAnimationProperties: AnimationProperties = {
  delay: '', duration: `${toHeightDuration}ms`, easing: ''
}

@Component({
  selector: 'app-risk-profile',
  templateUrl: './risk-profile.component.html',
  styleUrls: ['../widgets.css'],
  animations: [
    AnimationService.getFoldTrigger(foldAnimationProperties),
    AnimationService.getScaleTrigger(1.25),
    AnimationService.getToHeightTrigger(toHeightAnimationProperties),
  ]
})
export class RiskProfileComponent implements OnInit {

  public holdings ?: Holding[];
  public tickers: string[] = [];
  public dates ?: string[]

  public loading : boolean = false;
  public optionalArguments : FormGroup;
  
  public calcBtnAnimationControl : AnimationControl = this.animator.initAnimation();
  public clearBtnAnimationControl : AnimationControl = this.animator.initAnimation();
  public inputCardAnimationControl = this.animator.initAnimation();
  public outputCardAnimationControl = this.animator.initAnimation();

  constructor(public animator : AnimationService, public formBuilder : FormBuilder,
              public api: ApiService) { 
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
      this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.none);
      setTimeout(()=>{
        this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.full);
      }, toHeightDuration)
    })
  }

  public clear() : void {
    this.holdings = undefined; this.tickers = []; this.dates = undefined;
    this.optionalArguments.enable()
    this.outputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.forty);
    setTimeout(()=>{
      this.inputCardAnimationControl = this.animator.animateToHeight(animationControls.toHeight.states.sixty)
    }, toHeightDuration)
  }

  public setTickers(tickers: string[]){ this.tickers = tickers; }
  
  public removeTicker(ticker : string): void{  this.tickers.splice(this.tickers.indexOf(ticker), 1); }

  public setDates(dates : string[]){ this.dates = dates}

  public removeDates(){ this.dates = undefined; }
}
