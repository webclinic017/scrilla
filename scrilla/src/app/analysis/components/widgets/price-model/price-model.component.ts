import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiscountDividend } from 'src/app/models/pricing';
import { AnimationService } from 'src/app/services/animations.service';
import { ApiService, QueryParams } from 'src/app/services/api.service';
import { Widget } from '../widget';

export const pricingModels ={
  ddm: 'discount_dividend_model'
}

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

  public selectedModel : string = pricingModels.ddm;

  public results : DiscountDividend[] | undefined;

  public loading : boolean = false;

  constructor(public animator : AnimationService,public api: ApiService,
              public formBuilder : FormBuilder) { 
    super(animator, api, formBuilder)
  }
  
  ngOnInit(): void {}

  // TODO: generalize to allow user to select pricing model and include model in params.
  //        posssibly. depends on how I implement other pricing models.
  public calculate(): void{
    let params : QueryParams={ tickers: this.tickers, }
    this.api.dividend_model(params).subscribe((data)=>{
      this.results = data;
      super.animateCalculate();
    })
  }

  public clear(): void{
    this.results = undefined; this.tickers = [];
    super.animiateClear();
  }
}
